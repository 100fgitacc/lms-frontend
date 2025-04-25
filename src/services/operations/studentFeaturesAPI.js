import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

// ================ buyCourse ================ 
export async function buyCourse(token, coursesId, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try {
        const res = await loadScript("https://sandbox.paypal.com/sdk/js?client-id=AfgEbhErRQBIRW2BEPiLXiwmcjSdB6WdNZx3OBWGwDpdc_DcAaeGVCosb-RYCtXDROyiPBFBtoEjTbTO&components=buttons");
        
        if (!res) {
            console.error("PayPal SDK failed to load");
            toast.error("PayPal SDK failed to load");
            return;
        }
        // Initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, { coursesId }, {
            Authorization: `Bearer ${token}`,
        });
        
        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

       
        
        if (orderResponse.data.amount === 0) {
            toast.dismiss(toastId);
            toast.success("Free course — enrolling...");
            
            const orderDetails = {
                id: "FREE_ORDER_ID",
                status: "COMPLETED",
            };

            verifyPayment({ ...orderDetails, coursesId }, token, navigate, dispatch);
            return;
        }else {
            const orderData = orderResponse.data.message;
            const amount = orderResponse.data.amount;  

            if (!orderData || !orderData.id || !orderData.links) {
                console.error("Invalid order data structure:", orderData);
                toast.error("Invalid order data received");
                return;
            }

            window.paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: 'USD', 
                                value: amount 
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        
                        verifyPayment({ ...details, coursesId }, token, navigate, dispatch);
                    });
                },
                onError: function(error) {
                    toast.error("Oops, payment failed");
                    console.log("Payment failed: ", error);
                }
            }).render('#paypal-button-container');
        }
        


        
        

    } catch (error) {
        console.error("Payment API error: ", error);
        toast.error(error.response?.data?.message || "Could not make Payment");
    }

    toast.dismiss(toastId);
}




// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        }, {
            Authorization: `Bearer ${token}`
        })
    }
    catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}


// ================ verify payment ================
async function verifyPayment(bodyData, token, navigate, dispatch) {
    
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));

    try {

        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        toast.success("Payment Successful, you are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}

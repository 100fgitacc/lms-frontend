import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import Loading from './../components/common/Loading';
function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const { accountType, firstName, lastName, email, password, confirmPassword, } = signupData;

    dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
  };

 return (
    <div className="verify-page">
      {loading ? (
        <div className="verify-loading">Loading...</div>
      ) : (
        <div className="wrapper">
          <h1 className="form-title">Verify Email</h1>
          <p >
            A verification code has been sent to you. Enter the code below
          </p>

          <form onSubmit={handleVerifyAndSignup}>
            <div className="otp-wrapper">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props) => (
                  <input
                    {...props}
                    placeholder="-"
                    className="otp-input"
                  />
                )}
                containerStyle={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px', 
                }}
              />
            </div>

            <button type="submit" className="button otp-btn">Verify Email</button>
          </form>

          <div className="verify-footer">
            <Link to="/signup" className="back-link">
              <BiArrowBack /> Back To Signup
            </Link>

            <button
              className="resend-btn"
              onClick={() => {
                dispatch(sendOtp(signupData.email, navigate));
                setOtp('');
              }}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
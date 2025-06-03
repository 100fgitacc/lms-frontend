import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import IconBtn from "../../../common/IconBtn"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"


import styles from '../profile.module.css'


export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleBuyCourse = async () => {
    setPayPalOn(true);
    const courses = cart.map((course) => course._id)
    await buyCourse(token, courses, user, navigate, dispatch)
  }
  const [payPalOn, setPayPalOn] = useState(false);
  return (
    <div>
      <h3>Total amounth:</h3>
      <p className={styles['cart-price']}>{total} $</p>
      
      {!payPalOn ? (
        <IconBtn
          text="Buy Now"
          onclick={handleBuyCourse}
        />
      ) : (
        <div id="paypal-button-container"></div>
      )}
     
    </div>
  )
}
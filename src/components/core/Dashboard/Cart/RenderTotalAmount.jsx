import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import IconBtn from "../../../common/IconBtn"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleBuyCourse = async () => {
    const courses = cart.map((course) => course._id)
    await buyCourse(token, courses, user, navigate, dispatch)
  }

  return (
    <div className="min-w-[280px] rounded-md p-6 bg-blue-500  w-full lg:w-[30%]">
      <p className="mb-1 text-sm font-medium ">Total:</p>
      <p className="mb-6 text-3xl font-wadik text-yellow-100">{total} $</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
      <div id="paypal-button-container" className="mt-5"></div>
    </div>
  )
}
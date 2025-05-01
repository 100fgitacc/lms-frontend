import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { TbListDetails } from "react-icons/tb";
// import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"
import Img from './../../common/Img';
import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"


function Course_Card({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0)

  
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  
 
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }


  const cart = useSelector((state) => state.cart);
  

  const [isCourseInCart, setIsCourseInCart] = useState(false);

  const some = cart.cart.find(item => item._id === course._id);
 

  return (
    <div className=" transition-all duration-200 ">
       <Link className="border border-gray rounded-xl h-full flex flex-col" to={`/courses/${course._id}`}>
          <Img
            src={course?.thumbnail}
            alt="course thumbnail"
            className="rounded-t-xl object-cover h-[150px] w-full"
          />
          <div className="px-5 py-3 flex flex-col h-full">
            <div>
              <p className="font-wadik text-xs text-yellow-100 my-2">{course?.courseName}</p>
              <p className="text-xs font-thin text-blue-400 opacity-30 my-2">{course?.instructor?.firstName}</p>
              <p className="text-[13px] line-clamp-3 mb-3 font-thin">{course?.courseDescription}</p>
            </div>
            <div className="mt-auto mb-0">
              <div className="flex items-center">
                <RatingStars Star_Size={15} Review_Count={avgReviewCount} />
                <span className="text-gray ml-1 text-sm">({ avgReviewCount || 0 })</span>
              </div>
              <p className="text-[19px] font-wadik my-2 text-right">{course?.price === 0 ? "Free" : `$${course?.price}`}</p>
              <div className="flex items-center justify-between ">
                <Link className="text-sm underline font-thin flex items-center" to={`/courses/${course._id}`}>
                  <TbListDetails />
                  <span className="ml-1">Course details </span>
                </Link>
                {(!user || !course?.studentsEnrolled.includes(user?._id) && !some?._id && user?.accountType === ACCOUNT_TYPE.STUDENT) ? (
                  <button onClick={handleAddToCart} className="cursor-pointer rounded-md py-[5px] px-[15px] duration-300 bg-yellow-100 hover:opacity-80 text-black text-sm" >
                    Add to Cart
                  </button>
                ) : some?._id === course._id && user?.accountType === ACCOUNT_TYPE.STUDENT? (<p className="text-sm text-gray">Already in Cart</p>): user?.accountType === ACCOUNT_TYPE.STUDENT ?(<p className="text-sm text-gray">Purchased</p>) : null
                }
              </div>

              
            </div>
            
          </div>
        </Link>
     
    </div>

  )
}

export default Course_Card

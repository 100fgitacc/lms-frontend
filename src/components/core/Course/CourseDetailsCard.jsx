import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Img from './../../common/Img';


function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

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

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)
  

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl  p-4 text-white bg-blue-600`}
      >
        {/* Course Image */}
        <Img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="font-wadik space-x-3 pb-4 text-3xl font-semibold">
          {CurrentPrice} $
          </div>
          <div className={``}>
            <p className={`my-2 text-md text-yellow-100 font-semibold`}>
              Course Requirements
            </p>
            <div className="flex flex-col gap-3 text-sm">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2 items-center`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>

          
          <div className={`flex flex-col gap-1 bg-blue-800 rounded-2xl px-3 ${user?.accountType === ACCOUNT_TYPE.STUDENT && 'pt-5'} mt-7`}>
            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <button
              className="yellowButton outline-none"
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
             {user && course?.studentsEnrolled.includes(user?._id)
              ? "Go To Course"
              : user && CurrentPrice === 0
                ? "Join For Free"
                : "Buy Now"}
            </button>
              )
            }
            
            <div id="paypal-button-container"></div>
            {(!user || !course?.studentsEnrolled.includes(user?._id) && user?.accountType === ACCOUNT_TYPE.STUDENT) && (
              <button onClick={handleAddToCart} className="bg-blue-700 p-3 rounded-md outline-none">
                Add to Cart
              </button>
             )}
            <div className="text-center">
              <button
                className="mx-auto flex items-center py-2 text-yellow-100 mb-2 font-thin text-sm"
                onClick={handleShare}
              >
                <FaShareSquare size={15} /> <span className="ml-1">Share</span>
              </button>
            </div>
          </div>

         
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard
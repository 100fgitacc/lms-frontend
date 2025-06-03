
import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { FaShareSquare } from "react-icons/fa"
// import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/common/Footer"
import RatingStars from "../components/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"

import GetAvgRating from "../utils/avgRating"
import { ACCOUNT_TYPE } from './../utils/constants';
import { addToCart } from "../slices/cartSlice"

import { IoChevronBack    } from 'react-icons/io5'
import { MdOutlineVerified } from 'react-icons/md'
import Img from './../components/common/Img';
import toast from "react-hot-toast"




function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  // Getting courseId from url parameter
  const { courseId } = useParams()
  // console.log(`course id: ${courseId}`)

  // Declear a state to save the course details
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [isHidden, setIsHidden] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {  
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Убедитесь, что событие срабатывает сразу после загрузки

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    // Calling fetchCourseDetails fucntion to fetch the details
    const fectchCourseDetailsData = async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        // console.log("course details res: ", res)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    }
    fectchCourseDetailsData();
  }, [courseId])

  // console.log("response: ", response)

  // Calculating Avg Review count
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])
  // console.log("avgReviewCount: ", avgReviewCount)

  // Collapse all
  // const [collapse, setCollapse] = useState("")
  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  // Total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  // Loading skeleton
  if (paymentLoading || loading || !response) {
    return (
      <div className={`mt-24 p-5 flex flex-col justify-center gap-4  `}>
        <div className="flex flex-col sm:flex-col-reverse  gap-4 ">
          <p className="h-44 sm:h-24 sm:w-[60%] rounded-xl skeleton"></p>
          <p className="h-9 sm:w-[39%] rounded-xl skeleton"></p>
        </div>

        <p className="h-4 w-[55%] lg:w-[25%] rounded-xl skeleton"></p>
        <p className="h-4 w-[75%] lg:w-[30%] rounded-xl skeleton"></p>
        <p className="h-4 w-[35%] lg:w-[10%] rounded-xl skeleton"></p>

        {/* Floating Courses Card */}
        <div className="right-[1.5rem] top-[20%] hidden lg:block lg:absolute min-h-[575px] w-1/3 max-w-[410px] 
            translate-y-24 md:translate-y-0 rounded-xl skeleton">
        </div>

        <p className="mt-24 h-60 lg:w-[60%] rounded-xl skeleton"></p>
      </div>
    )
  }


  // extract course data
  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
    tag
  } = response?.data?.courseDetails

  // Buy Course handler
  const handleBuyCourse = () => {
    if (token) {
      const coursesId = [courseId]
      buyCourse(token, coursesId, user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // Add to cart Course handler
  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(response?.data.courseDetails))
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

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }



  return (
    <>
      <div className={``}>
        {/* Hero Section */}
        <div className="">
          <div className="">

            {/* Go back button */}
            <div className="" onClick={() => navigate(-1)}>
              <IoChevronBack    className="" />
              <p className="">Back to courses</p>
            </div>

            {/* will appear only for small size */}
            <div className="">
              <Img
                src={thumbnail}
                alt="course thumbnail"
                className=""
              />
              <div className=""></div>
            </div>
           
           
            {/* Course data */}
            <div className={``}>
              
              
              <div className="">
               <div className="">
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} className='mr-0 ml-auto'/>
                <span className="">{`(${ratingAndReviews.length} reviews)`}</span>
               </div>
               
                <div className="">
                  <span>{`${studentsEnrolled.length} `}</span>
                </div>
              </div>
              <p className="">{courseName}</p>
              <div className="">
                  <span>
                    {courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span>{response.data?.totalDuration} Total Time</span>
                </div>
              <p className=''>{courseDescription}</p>
             
            </div>
            <div className="">
              <p className="">What you'll learn ?</p>
              {whatYouWillLearn && (
                whatYouWillLearn.split('\n').map((line, index) => (
                  <div key={index} className="">
                    <p className="">{index + 1}.</p>
                    <p className="">{line}</p>
                  </div>
                ))
              )}
            </div>
            <div className="">
              <div className="">
                <p className="">Tags:</p>
                <div className="">
                  {
                    tag && tag.map((item, ind) => (
                      <p key={ind} className="" >
                        {item}
                      </p>
                    ))
                  }
                </div>
              </div>
              <div className="">
                <div className="">
                    <p className="">
                      {" "}
                      <BiInfoCircle /> Created at {formatDate(createdAt)}
                    </p>
                    <p className="">{" "} <HiOutlineGlobeAlt /> English</p>
                </div>
                <div className="">
                  <div className="">
                    <Img
                      src={instructor.image}
                      alt="Author"
                      className=""
                    />
                    <div className="">
                      <p className="">{`${instructor.firstName} ${instructor.lastName}`}
                        <span><MdOutlineVerified className='' /></span>
                      </p>
                      <p className="">{instructor?.additionalDetails?.about}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
           <div className={` lg:hidden w-full flex flex-col gap-1 bg-blue-800 rounded-2xl px-3 ${user?.accountType === ACCOUNT_TYPE.STUDENT && 'pt-5'} mt-7`}>
                       {
                         user?.accountType === ACCOUNT_TYPE.STUDENT && (
                          <>
                           <button
                            className="yellowButton outline-none"
                            onClick={
                              user && response?.data?.courseDetails?.studentsEnrolled.includes(user?._id)
                                ? () => navigate("/dashboard/enrolled-courses")
                                : handleBuyCourse
                            }
                          >
                            {user && response?.data?.courseDetails?.studentsEnrolled.includes(user?._id)
                              ? "Go To Course"
                              : "Buy Now"}
                            </button>
                            {isHidden && (<div id="paypal-button-container" ></div>)}
                             
                          </>
                        
                       
                         )
                       }
                       
                       {(!user || !response?.data?.courseDetails?.studentsEnrolled.includes(user?._id) && user?.accountType === ACCOUNT_TYPE.STUDENT) && (
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

          {/* Floating Courses Card */}
          <div className="right-[1.5rem]  top-[60px] mx-auto hidden lg:block lg:absolute min-h-[600px] w-1/3 max-w-[410px] mt-4 md:mt-0">
            <CourseDetailsCard
              course={response?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto  px-4 text-start text-white lg:w-[1260px] w-[100%]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0">
          {/* Course Content Section */}
          <div className="md:max-w-[830px] mt-5 md:mt-9 p-0 md:p-8 mb-[100px] md:px-0">
            <div className="flex justify-between gap-3 items-center">
              <p className="font-wadik">Course Content</p>
              <button
                  className="text-gray text-[12px] md:text-sm"
                  onClick={() => setIsActive([])}
                >
                  Collapse All Sections
                </button>
            </div>

            {/* Course Details Accordion - section Subsection */}
            <div className="py-4 ">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

           
          </div>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
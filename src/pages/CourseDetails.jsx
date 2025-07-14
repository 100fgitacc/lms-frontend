
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"

import GetAvgRating from "../utils/avgRating"
import { ACCOUNT_TYPE } from './../utils/constants';
import { addToCart } from "../slices/cartSlice"
import { IoChevronBack    } from 'react-icons/io5'
import toast from "react-hot-toast"



import styles from './coursePage.module.css'
import Sidebar from "../components/core/Dashboard/sidebar/sidebar";
import Header from "../components/common/header/header";
import CourseOverview from "../components/core/ViewCourse/CourseOverview";
import ContentHeader from "../components/core/ViewCourse/ContentHeader";


import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData
} from "../slices/viewCourseSlice"

import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"


function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isHidden = useSelector((state) => state.sidebar.isSidebarHidden);
 useEffect(() => {
      ; (async () => {
        const courseData = await getFullDetailsOfCourse(courseId, token, null)
        
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
        dispatch(setEntireCourseData(courseData.courseDetails))
        dispatch(setCompletedLectures(courseData.completedVideos))
      
        let lectures = 0
        courseData?.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec.subSection.length
        })
        dispatch(setTotalNoOfLectures(lectures))
      })()
  
    }, [])

  const [content, setContent] = useState('Single-course');

  const handleSetContent = (e) => {
      setContent(e);
  } 


  // Getting courseId from url parameter
  const { courseId } = useParams()
  // console.log(`course id: ${courseId}`)

  // Declear a state to save the course details
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

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
      <div className='page-template'>
        <Sidebar/>
        <div className={`content ${styles['course-overview']} ${styles['lesson-content']} ${isHidden? 'full-width': ''} `}>
            <Header/>
            <div className={`content-inner ${styles['lesson-content-inner']} ${!isHidden  && styles['lesson-content-inner-full']}`}>
                <div>
                  <div className={styles['back-button']} onClick={() => navigate(-1)}>
                    <IoChevronBack    className="" />
                    <p className="">Back to catalog</p>
                  </div>
                  <ContentHeader page={'course-purchased'} content={content}/>
                  <h2 className={`${styles.title} secondary-title`}>Course content</h2>
                  <CourseOverview content={'course-overview'}/>
                </div>
            </div>
        </div>
          {/* {confirmationModal && <ConfirmationModal modalData={confirmationModal} />} */}
    </div>
  )
}

export default CourseDetails
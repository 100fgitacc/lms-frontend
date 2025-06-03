import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion';
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"


import { setCourseViewSidebar } from "../slices/sidebarSlice"


import styles from './coursePage.module.css'
import Sidebar from "../components/core/Dashboard/sidebar/sidebar";
import Header from "../components/common/header/header";
import CourseContent from "../components/core/ViewCourse/CourseContent";
import CourseOverview from "../components/core/ViewCourse/CourseOverview";
import ContentHeader from "../components/core/ViewCourse/ContentHeader";
import PagePagination from "../components/core/page-pagination";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function CoursePage() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)


  // get Full Details Of Course
  useEffect(() => {
    ; (async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
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

  


  // handle sidebar for small devices
  const { courseViewSidebar } = useSelector(state => state.sidebar)
  const [screenSize, setScreenSize] = useState(undefined)

  // set curr screen Size
  useEffect(() => {
    const handleScreenSize = () => setScreenSize(window.innerWidth)

    window.addEventListener('resize', handleScreenSize);
    handleScreenSize();
    return () => window.removeEventListener('resize', handleScreenSize);
  })

  // close / open sidebar according screen size
  useEffect(() => {
    if (screenSize <= 640) {
      dispatch(setCourseViewSidebar(false))
    } else dispatch(setCourseViewSidebar(true))
  }, [screenSize])
    

  const isHidden = useSelector((state) => state.sidebar.isSidebarHidden);
  const [content, setContent] = useState('Single-course');
  
  const handleSetContent = (e) => {
      setContent(e);
  }
    
  return (
    <div className='page-template'>
        <Sidebar/>
        <div className={`content ${styles['lesson-content']} ${isHidden? 'full-width': ''} `}>
            <Header/>
            <div className={`content-inner ${styles['lesson-content-inner']} ${!isHidden  && styles['lesson-content-inner-full']}`}>
                <div>
                    <CourseOverview content={content}/>
                </div>
                <div>
                    <ContentHeader page={'course-purchased'}/>
                    <PagePagination currPage={'single-course'} renderPageContent={handleSetContent}/>
                    <CourseContent content={'Lesson'}/>
                </div>
            </div>
        </div>
          {/* {confirmationModal && <ConfirmationModal modalData={confirmationModal} />} */}
    </div>


     

      /* {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />} */
  )
}

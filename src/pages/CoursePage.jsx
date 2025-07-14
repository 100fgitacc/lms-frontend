import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"


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
  setCurrentContentPage
} from "../slices/viewCourseSlice"

export default function CoursePage() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()


  // get Full Details Of Course
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


  const isHidden = useSelector((state) => state.sidebar.isSidebarHidden);

  
  const content = useSelector((state) => state.viewCourse.currentContentPage);

  const handleSetContent = (page) => {
    dispatch(setCurrentContentPage(page));
  };

  const { sectionId, subSectionId } = useParams();

  const courseSectionData = useSelector(state => state.viewCourse.courseSectionData);
  const currentSection = courseSectionData?.find(section => section._id === sectionId);
  const currentSubSection = currentSection?.subSection?.find(sub => sub._id === subSectionId);



  return (
    <div className='page-template'>
        <Sidebar/>
        <div className={`content ${styles['lesson-content']} ${isHidden? 'full-width': ''} `}>
            <Header/>
            <div className={`content-inner ${styles['lesson-content-inner']} ${!isHidden  && styles['lesson-content-inner-full']}`}>
                <div>
                    <CourseOverview content={content} />
                </div>
                <div>
                    <ContentHeader page={'course-purchased'}/>
                    <PagePagination
                      currPage={'single-course'}
                      renderPageContent={handleSetContent}
                      currentSubSection={currentSubSection}
                      content={content}
                    />
                    {currentSubSection?.requiresHomeworkCheck && (
                      <div className={`${styles['lesson-homework-mark']}`}>
                        <p>
                          Please note: This lesson includes an evaluated homework assignment!
                        </p>
                        <img src='/assets/img/icons/medal.png' alt='icon'/>
                      </div>
                    )}
                    <h3 className={styles['course-content-title']}>{currentSubSection?.title}</h3>
                    <CourseContent content={content} />
                </div>
            </div>
        </div>
    </div>
  )
}

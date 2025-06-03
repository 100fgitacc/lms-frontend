import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { setCourseViewSidebar } from "../../../slices/sidebarSlice"

import IconBtn from "../../common/IconBtn"

import { HiMenuAlt1 } from 'react-icons/hi'
import UploadDocs from "../Dashboard/AddCourse/UploadDocs"


import styles from '../../../pages/coursePage.module.css'
import CourseOverview from "./CourseOverview"
import ContentHeader from "../Dashboard/content-header"








const CourseContent = ({content, data}) => {
  const { courseId, sectionId, subSectionId } = useParams()

  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()

  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ; (async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        // console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        // console.log("filteredData", filteredData)
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        // console.log("filteredVideoData = ", filteredVideoData)
        if (filteredVideoData) setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)

    const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)

    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId)

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx + 1]._id

      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId = courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)

    const noOfSubsections = courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId = courseSectionData[currentSectionIndx].subSection[currentSubSectionIndx - 1]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength = courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId = courseSectionData[currentSectionIndx - 1].subSection[prevSubSectionLength - 1]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  // handle Lecture Completion
  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  const { courseViewSidebar } = useSelector(state => state.sidebar)

  // this will hide course video , title , desc, if sidebar is open in small device
  // for good looking i have try this 
  if (courseViewSidebar && window.innerWidth <= 640) return;



  const currentTimeRef = useRef(0)

useEffect(() => {
  const player = playerRef.current?.video

  if (player) {
    const videoElement = player.video

    const handleTimeUpdate = () => {
      currentTimeRef.current = videoElement?.currentTime || 0
    }

    const handleSeeking = () => {
      const newTime = videoElement?.currentTime
      const lastTime = currentTimeRef.current

      if (newTime > lastTime) {
        videoElement.currentTime = lastTime
      }
    }

    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("seeking", handleSeeking)

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate)
        videoElement.removeEventListener("seeking", handleSeeking)
      }
    }
  }
}, [videoData])


  
   
    return (
      <>
        {
          content === 'Lesson' ? (
          <div className={styles['content-container']}>
                {!videoData ? (
                  <img
                  src={previewSource}
                  alt="Preview"
                  />
              ) : (
                  <Player
                  ref={playerRef}
                  aspectRatio="16:9"
                  playsInline
                  // autoPlay
                  onEnded={() => setVideoEnded(true)}
                  src={videoData?.videoUrl}
                  className={styles['course-player']}
                  >
                  <BigPlayButton position="center" />
                  {/* Render When Video Ends */}
                  {videoEnded && (
                      <div className={styles['video-ended-controls']}>
                          {!isFirstVideo() && (
                          <button
                              disabled={loading}
                              onClick={goToPrevVideo}
                              className={`button ${styles['button-step']}`}
                          >
                              Prev lecture
                          </button>
                          )}
                          {!completedLectures.includes(subSectionId) && (
                              <IconBtn
                              disabled={loading}
                              onclick={() => handleLectureCompletion()}
                              text={!loading ? "Mark As Completed" : "Loading..."}
                              />
                          )}
                          <IconBtn
                              disabled={loading}
                              onclick={() => {
                              if (playerRef?.current) {
                                  playerRef?.current?.seek(0)
                                  setVideoEnded(false)
                              }
                              }}
                              text="Rewatch"
                          />
                          {!isLastVideo() && (
                              <button
                                  disabled={loading}
                                  onClick={goToNextVideo}
                                  className={`button ${styles['button-step']}`}
                              >Next lecture</button>
                          )}
                      </div>
                  )}
                  </Player>
              )}
              <div className={styles.wrapper}>
                  <h4 className={styles.materials}>Upload your materials:</h4>
                  <UploadDocs type="text"/>
              </div>
      
          </div>
        ):(
          <>
            <ContentHeader page={'course'}/>
            <h2 className={`${styles.title} secondary-title`}>Course content</h2>
            <CourseOverview/>
          </>
        )
      }
      </>
    );
};

export default CourseContent;

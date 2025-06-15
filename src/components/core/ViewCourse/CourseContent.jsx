import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"

import IconBtn from "../../common/IconBtn"
import styles from '../../../pages/coursePage.module.css'
import CourseOverview from "./CourseOverview"
import ContentHeader from "../Dashboard/content-header"
import Loader from "../../common/Loader"
import UploadDocs from "../Dashboard/AddCourse/UploadDocs"

const CourseContent = ({ content }) => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const playerRef = useRef(null)
  
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)
  const { courseViewSidebar } = useSelector((state) => state.sidebar)

  const [videoData, setVideoData] = useState(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [maxWatched, setMaxWatched] = useState(0)
  const [duration, setDuration] = useState(0)

  // determine if lecture is completed
  const isCompleted = completedLectures.includes(subSectionId)

  useEffect(() => {
    if (!courseSectionData.length) return
    if (!courseId || !sectionId || !subSectionId) {
      navigate("/dashboard/enrolled-courses")
      return
    }
    const section = courseSectionData.find((sec) => sec._id === sectionId)
    const subsection = section?.subSection.find((sub) => sub._id === subSectionId)
    setVideoData(subsection || null)
    setVideoEnded(false)
    setCurrentTime(0)
    setMaxWatched(0)
  }, [courseSectionData, location.pathname])

  useEffect(() => {
    const video = playerRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const t = video.currentTime
      setCurrentTime(t)
      if (!isCompleted && t > maxWatched) setMaxWatched(t)
    }
    const handleSeeking = () => {
      if (!isCompleted && !videoData?.enableSeek && video.currentTime > maxWatched + 0.5) {
        video.currentTime = maxWatched;
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('seeking', handleSeeking)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('seeking', handleSeeking)
    }
  }, [videoData, maxWatched, isCompleted])

  const handleLoadedMetadata = () => {
    const video = playerRef.current
    if (video) setDuration(video.duration)
  }

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    const video = playerRef.current;
    const allowedMax = isCompleted || videoData?.enableSeek ? duration : maxWatched;
    if (video && newTime <= allowedMax) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }
  
  const isFirstVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId)
    const subIndex = courseSectionData[sectionIndex]?.subSection.findIndex((s) => s._id === subSectionId)
    return sectionIndex === 0 && subIndex === 0
  }

  const isLastVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId)
    const subIndex = courseSectionData[sectionIndex]?.subSection.findIndex((s) => s._id === subSectionId)
    return (
      sectionIndex === courseSectionData.length - 1 &&
      subIndex === courseSectionData[sectionIndex].subSection.length - 1
    )
  }

  const goToNextVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId)
    const subIndex = courseSectionData[sectionIndex]?.subSection.findIndex((s) => s._id === subSectionId)
    const currentSection = courseSectionData[sectionIndex]
    if (subIndex < currentSection.subSection.length - 1) {
      const nextSubId = currentSection.subSection[subIndex + 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubId}`)
    } else if (courseSectionData[sectionIndex + 1]) {
      const nextSection = courseSectionData[sectionIndex + 1]
      const nextSubId = nextSection.subSection[0]._id
      navigate(`/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSubId}`)
    }
  }

  const goToPrevVideo = () => {
    const sectionIndex = courseSectionData.findIndex((s) => s._id === sectionId)
    const subIndex = courseSectionData[sectionIndex]?.subSection.findIndex((s) => s._id === subSectionId)
    if (subIndex > 0) {
      const prevSubId = courseSectionData[sectionIndex].subSection[subIndex - 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubId}`)
    } else if (sectionIndex > 0) {
      const prevSection = courseSectionData[sectionIndex - 1]
      const prevSubId = prevSection.subSection[prevSection.subSection.length - 1]._id
      navigate(`/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubId}`)
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete({ courseId, subsectionId: subSectionId }, token)
    if (res) dispatch(updateCompletedLectures(subSectionId))
    setLoading(false)
  }

  if (courseViewSidebar && window.innerWidth <= 640) return null

  const watchedPercent = duration ? ((isCompleted ? duration : maxWatched) / duration) * 100 : 0

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
    if (!data.answerText && !data.homeworkFile) {
      toast.error("Please provide either a text answer or attach a file.");
      return;
    }

    onSubmitHomework(data);
    reset();
  };
  const [previewFileUrl, setPreviewFileUrl] = useState("")
  return (
    <>
      {content === 'Lesson' ? (
        <div className={styles['content-container']}>
          {videoData ? (
            <div className={styles['video-wrapper']}>
              <video
                ref={playerRef}
                width="100%"
                controls={false}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setVideoEnded(true)}
                src={videoData.videoUrl}
                className={styles['video-element']}
              />
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={handleProgressChange}
                className={styles['progress-bar']}
                style={{
                  width: '100%',
                  background: `linear-gradient(to right, ${
                    videoData?.enableSeek ? '#3b82f6' : '#a1a1aa'
                  } 0%, ${
                    videoData?.enableSeek ? '#3b82f6' : '#a1a1aa'
                  } ${watchedPercent}%, #e5e7eb ${watchedPercent}%, #e5e7eb 100%)`,
                  height: '8px',
                  borderRadius: '8px',
                  boxShadow: videoData?.enableSeek
                    ? '0 0 4pxrgb(106, 151, 206)'
                    : ''
                }}
              />
              <div className={styles['controls']}>
                <div className={styles['controls']}>
                  {playerRef.current?.paused ? (
                    <button
                      className={styles['play-btn']}
                      onClick={() => playerRef.current.play()}
                    >
                      ▶︎ Play
                    </button>
                  ) : (
                    <button
                      className={styles['play-btn']}
                      onClick={() => playerRef.current.pause()}
                    >
                      ❚❚ Pause
                    </button>
                  )}
                </div>
              </div>
              {videoEnded && (
                <div className={styles['video-ended-controls']}>
                  {!isFirstVideo() && <button disabled={loading} onClick={goToPrevVideo} className={`button ${styles['button-step']}`}>Prev</button>}
                  {!completedLectures.includes(subSectionId) && <IconBtn disabled={loading} onclick={handleLectureCompletion} text={loading ? 'Loading...' : 'Mark Completed'} />}
                  {!isLastVideo() && <button disabled={loading} onClick={goToNextVideo} className={`button ${styles['button-step']}`}>Next</button>}
                </div>
              )}
              <div className={`${styles.wrapper} ${styles['homework-wrapper']}`}>
                <h4 className={styles.title}>Lesson description:</h4>
                <p className={styles['lesson-desc']}>{videoData.description}</p>
                <h4 className={styles.title}>Homework:</h4>
                {videoData?.homeworks.length > 0 ?
                  (
                    <div className={`${styles['homework-materials']}`}>
                      {videoData.homeworks.length > 0 &&
                      videoData.homeworks.map((item, index) => (
                        <div key={item._id || index} style={{ marginBottom: '1rem' }}>
                          {item.type === 'text' && (
                            <>
                              <h6>Your task:</h6>
                              <p>{item.value}</p>
                            </>
                          )}

                          {item.type === 'link' && (
                            <>
                              <h6>Useful link:</h6>
                              <a href={item.value} target="_blank" rel="noopener noreferrer">
                                {item.value}
                              </a>
                            </>
                          )}

                          {item.type === 'file' && (
                            <>
                              <h6>Lesson materials:</h6>
                              <a href={item.value.url} download={item.value.filename}>
                                {item.value.filename}
                              </a>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <small>This lesson is not including homework!</small>
                  )
                }
              </div>
            </div>
          ) : (
            <Loader/>
          )}
         
        </div>
      ) : content === 'Homework' ? (
        <>
          <div className={`${styles['homework-wrapper']} ${styles.wrapper}`}>
            <h5 className={`${styles['homework-title']} `}>Homework:</h5>
            <div className={`${styles['homework-materials']}`}>
            {videoData.homeworks.length > 0 &&
            videoData.homeworks.map((item, index) => (
              <div key={item._id || index} style={{ marginBottom: '1rem' }}>
                {item.type === 'text' && (
                  <>
                    <h6>Your task:</h6>
                    <p>{item.value}</p>
                  </>
                )}

                {item.type === 'link' && (
                  <>
                    <h6>Useful link:</h6>
                    <a href={item.value} target="_blank" rel="noopener noreferrer">
                      {item.value}
                    </a>
                  </>
                )}

                {item.type === 'file' && (
                  <>
                    <h6>Lesson materials:</h6>
                    <a href={item.value.url} download={item.value.filename}>
                      {item.value.filename}
                    </a>
                  </>
                )}
              </div>
            ))}
            </div>
            <h5 className={`${styles['homework-title']}`}>Your Answer:</h5>
            <form onSubmit={handleSubmit(onSubmit)} className={styles["homework-zone"]}>
                <textarea
                  placeholder="Typing your answer"
                  className={`textarea`}
                  {...register("answerText")}
                />
                <UploadDocs
                  type="text"
                  name="homeworkFile"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  editData={previewFileUrl}
                />
                <button type="submit" className={`button`}>
                Send homework
              </button>

              
            </form>
          </div>
        </>
      ) : (
        <>
          <ContentHeader page={'course'} />
          <h2 className={`${styles.title} secondary-title`}>Course content</h2>
          <CourseOverview />
        </>
      )}
    </>
  )
}

export default CourseContent;

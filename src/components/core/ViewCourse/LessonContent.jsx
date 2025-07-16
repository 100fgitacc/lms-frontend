import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styles from '../../../pages/coursePage.module.css'
import Loader from "../../common/Loader"
import {useParams } from "react-router-dom"
import { setCurrentContentPage } from "../../../slices/viewCourseSlice"

export default function LessonContent({ videoData, homework, content  }) {

    const {  completedLectures } = useSelector((state) => state.viewCourse)
    const { courseId, subSectionId } = useParams()
    const isCompleted = completedLectures.includes(subSectionId)
    const [videoEnded, setVideoEnded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [maxWatched, setMaxWatched] = useState(0)
    const [duration, setDuration] = useState(0)
    const dispatch = useDispatch()
    const playerRef = useRef(null)
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

    const handleLectureCompletion = async () => {
        
        setLoading(true)
        const res = await markLectureAsComplete({ courseId, subsectionId: subSectionId }, token)
        
        if (res) dispatch(updateCompletedLectures(subSectionId))
        setLoading(false)
    }
    const watchedPercent = duration ? ((isCompleted ? duration : maxWatched) / duration) * 100 : 0

    const goToHomework = () => dispatch(setCurrentContentPage("Homework"));

    const [isPaused, setIsPaused] = useState(true)
    useEffect(() => {
        const video = playerRef.current;
        if (!video) return;

        const handlePlay = () => setIsPaused(false);
        const handlePause = () => setIsPaused(true);

        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        return () => {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        };
    }, [playerRef.current]);

    const handleRewatch = () => {
        const video = playerRef.current;
        if (video) {
        video.currentTime = 0;
        video.play();
        }
        setVideoEnded(false)
    };

    useEffect(() => {
    setVideoEnded(false)
    setCurrentTime(0)
    setMaxWatched(0)
    setIsPaused(true)
    }, [subSectionId])


    const [showVideoEndControls, setShowVideoEndControls] = useState(false)
    const videoContainerRef = useRef(null);

    const handleToggleFullscreen = () => {
    const container = videoContainerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        container.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
        });
    }
    };
    useEffect(() => {
    const video = playerRef.current;
    if (!video) return;

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
        video.controls = false;
        }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
    }, []);

    useEffect(() => {
    setVideoEnded(false);
    setShowVideoEndControls(false);
    setCurrentTime(0);
    setMaxWatched(0);
    setIsPaused(true);

    const video = playerRef.current;
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    }, [content]);

    return (
      <div className={styles['content-container']}>
          {videoData ? (
            <div ref={videoContainerRef} className={styles['video-container']}>
              <video
                key={subSectionId}
                ref={playerRef}
                width="100%"
                controls={false}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                  setVideoEnded(true)
                  setShowVideoEndControls(true)
                }}
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
                  {isPaused ? (
                    <button className={styles['play-btn']} onClick={() => playerRef.current.play()}>
                      ▶︎ Play
                    </button>
                  ) : (
                    <button className={styles['play-btn']} onClick={() => playerRef.current.pause()}>
                      ❚❚ Pause
                    </button>
                  )}
                  <button className={styles['fullscreen-btn']} onClick={handleToggleFullscreen}>
                    ⛶ Fullscreen
                  </button>
                </div>
              </div>
              {videoEnded && showVideoEndControls && (
                <div className={styles['video-ended-controls']}>
                  
                  { !completedLectures.some(item => item.subSectionId === subSectionId) ? (
                    <div className={styles['video-ended-container']}>
                      {videoData?.requiresHomeworkCheck ? (
                        <>
                          <h3 className={styles['video-ended-text']}>
                            Now you need to complete the homework to get access the next lesson
                          </h3>
                          <button className={styles['rewatch-btn']} onClick={handleRewatch}>
                            Rewatch
                          </button>
                          <button className={styles['rewatch-btn']}  onClick={() => setShowVideoEndControls(false)}>
                          Close 
                          </button>
                        </>
                      ) : (
                        <>
                          <h3 className={styles['video-ended-text']}>Go to next lesson!</h3>
                          <IconBtn
                            disabled={loading}
                            onclick={handleLectureCompletion}
                            text={loading ? "Loading..." : "Mark as Completed"}
                          />
                          <button className={styles['rewatch-btn']} onClick={handleRewatch}>
                            Rewatch
                          </button>
                          <button className={styles['rewatch-btn']}  onClick={() => setShowVideoEndControls(false)}>
                          Close
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className={styles['video-ended-container']}>
                      <h3 className={styles['video-ended-text']}>You are already done this lesson!</h3>
                      <button className={styles['rewatch-btn']} onClick={handleRewatch}>
                        Rewatch
                      </button>
                      <button className={styles['rewatch-btn']}  onClick={() => setShowVideoEndControls(false)}>
                      Close
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className={`${styles.wrapper} ${styles['homework-wrapper']}`}>
                <h4 className={styles.title}>Lesson description:</h4>
                <p className={styles['lesson-desc']}>{videoData.description}</p>

                {!homework?.score && (
                  <div className={styles['homework-heading']}>
                    <h4 >Homework:</h4>
                    <button className={styles['homework-btn']}  onClick={goToHomework}> Go to homework zone <span className={styles.arrow}>&rarr;</span></button>
                  </div>
                )}

                {videoData?.homeworks && (homework?.status !== 'reviewed' || homework?.status === 'not_reviewed') ? (
                  <div className={`${styles['homework-materials']}`}>
                    {videoData?.homeworks && videoData.homeworks.length > 0 ? (
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
                              <button
                                type="button"
                                onClick={() => downloadFile(item.value.url, item.value.filename)}
                                className={styles.downloadBtn}
                              >
                                {item.value.filename}
                              </button>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <small>This lesson does not include homework!</small>
                    )}
                  
                  </div>
                ) : homework.status === 'reviewed' ? (
                  <div className={`${styles['homework-wrapper']} ${styles.wrapper}`}>
                      {homework?.score && homework?.score > 0 ? (
                        <p>Lesson is done! Your score: {homework?.score} points </p>
                      ) : (
                        <p>Lesson is done!</p>
                      )}
                  </div>
                ) : homework.status === 'not_reviewed' ? (
                  <div className={`${styles['homework-wrapper']} ${styles.wrapper}`}>
                    <p>Your homework is under review</p>
                  </div>
                ) : (
                  null
                )}

              </div>
            </div>
          ) : (
            <Loader/>
          )}
         
        </div>
    )
}
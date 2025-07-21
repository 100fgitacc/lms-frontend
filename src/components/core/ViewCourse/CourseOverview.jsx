import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import RatingStars from '../../common/RatingStars';
import styles from '../../../pages/coursePage.module.css'
import {
  setCourseSectionData,
  setEntireCourseData
} from "../../../slices/viewCourseSlice"
import { getFullDetailsOfCourse } from "../../../services/operations/courseDetailsAPI"
import { getHomeworkBySubSection } from '../../../services/operations/studentFeaturesAPI';
import CourseReviewModal from './CourseReviewModal';
import { getAllStudentsData } from '../../../services/operations/adminApi';
import Loader from '../../common/Loader';

const CourseOverview  = ({content}) => {

    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)


    
    const [visibleItems, setVisibleItems] = useState({});

    const handleTextOpened = (elemIndex, index) =>{
        const key = `${elemIndex}-${index}`;
        if (visibleItems[key]) {
            setVisibleItems(prev => ({ ...prev, [key]: false }));
        } else {
            setVisibleItems(prev => ({ ...prev, [key]: true }));
        }
    }
    

    const { courseId, sectionId, subSectionId } = useParams()

    useEffect(() => {
    if (!courseEntireData?._id || !token) return;

    (async () => {
        const courseData = await getFullDetailsOfCourse(courseEntireData._id, token, null);
        if (courseData?.courseDetails?.courseContent) {
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        }
    })()
    }, [completedLectures, courseEntireData?._id, token]);


    const userId = useSelector(state => state.profile.user._id);
    const isUserEnrolled = courseEntireData?.studentsEnrolled?.some(enrollment => enrollment.user === userId);
    
    const isLectureAccessible = (section, lessonIndex, courseSections) => {
        if (!isUserEnrolled) return false;

        const lesson = section.subSection[lessonIndex];

        if (lesson.allowSkip) return true;

        const isCompleted = (id) =>
        completedLectures.some(lec => (typeof lec === "string" ? lec : lec.subSectionId) === id);

        if (lessonIndex === 0) {
            const firstSection = courseSections[0];
            if (section._id === firstSection._id) {
                return true;
            } else {
                const sectionIndex = courseSections.findIndex(s => s._id === section._id);
                if (sectionIndex > 0) {
                    const prevSection = courseSections[sectionIndex - 1];
                    const lastLessonPrevSection = prevSection.subSection[prevSection.subSection.length - 1];
                    return isCompleted(lastLessonPrevSection._id);
                }
                return false;
            }
        }

        const prevLesson = section.subSection[lessonIndex - 1];
        return isCompleted(prevLesson._id);
    };




    
    const [homeworks, setHomeworks] = useState({});
    
    
    useEffect(() => {
        const fetchHomeworks = async () => {
            if (!courseSectionData.length || !user?._id) return;

            const allHomeworkData = {};

            for (const section of courseSectionData) {
            for (const sub of section.subSection) {
                const data = await getHomeworkBySubSection(sub._id, token, user._id);
                allHomeworkData[sub._id] = data;
            }
            }

            setHomeworks(allHomeworkData);
        };

        fetchHomeworks();
    }, [courseSectionData, token, user]);

    const totalLessons = courseSectionData?.reduce(
      (sum, section) => sum + section.subSection.length,
      0
    );

    const currentLessonIds = new Set(
      courseSectionData?.flatMap(section => section.subSection.map(sub => sub._id))
    );





    
    
    const isLectureCompleted = (completedLectures, subSectionId, homeworks) => {
        const id = subSectionId.toString();
        const isWatched = completedLectures.some(lec =>
            typeof lec === 'string'
            ? lec === id
            : lec.subSectionId?.toString() === id
        );

      const isReviewed = homeworks?.[id]?.status === 'reviewed';
      const score = homeworks?.[id]?.score || 0;

      const passedHomework = isReviewed && score >= content.minScore;

      return isWatched || passedHomework;
    };
    const completedCount = courseSectionData.reduce((sum, section) => {
      return sum + section.subSection.filter(sub => 
        isLectureCompleted(completedLectures, sub._id, homeworks)
      ).length;
    }, 0);

    const allLessonsCompleted = totalLessons > 0 && completedCount === totalLessons;
    const [isAccordionCollapsed, setIsAccordionCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [reviewModal, setReviewModal] = useState(false)

    const hasUserReviewed = courseEntireData?.ratingAndReviews?.some(
      (review) => review?.user === userId
    );


      const [allStudents, setAllStudents] = useState([])
      const [studentsCount, setStudentsCount] = useState();
      const [loading, setLoading] = useState(false)
  
      useEffect(() => {
          const fetchAllStudents = async () => {
              setLoading(true)
              try {
              const { allStudentsDetails, studentsCount } = await getAllStudentsData(token)
              setAllStudents(allStudentsDetails)
              setStudentsCount(studentsCount)
              } catch (error) {
              console.error("Failed to fetch students:", error)
              } finally {
              setLoading(false) 
              }
          }
  
          fetchAllStudents()
      }, [token])
      function getStudentById(userId, allStudents) {
        return allStudents?.find(student => student._id === userId) || null;
      }
    return (
      <>
        {content !== 'course-overview' ? (
          <div className={`${styles['overview-wrapper']} ${styles['single-course']}`}>
            <button
              className={styles['back-to-button']}
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
            >
              Back to courses
            </button>

            {isMobile && (
              <button
                onClick={() => setIsAccordionCollapsed(prev => !prev)}
                className={styles['content-to-button']}
              >
                {isAccordionCollapsed ? 'Show course modules' : 'Hide course modules'}
              </button>
            )}

            <div
              className={`
                ${isMobile ? styles['collapsible-wrapper'] : ''}
                ${isAccordionCollapsed ? styles['collapsed'] : styles['expanded']}
              `}
            >
              <div className={styles['header-image']}>
                <h1 className={`${styles.title} main-title`}>{courseEntireData?.courseName}</h1>
              </div>

              {allLessonsCompleted && (
                <>
                  <div className={styles['course-finished-banner']}>
                    🎉 Congratulations! 🎉 You've completed this course! Great job!
                  </div>
                  {hasUserReviewed ? (
                    <div className={styles['course-finished-review']}>
                      <p className={styles['already-reviewed-text']}>
                        You’ve already submitted a review for this course. Thank you!
                      </p>
                    </div>
                  ) : (
                    <div className={styles['course-finished-review']}>
                      <p>Share your thoughts about the course</p>
                      <button
                        className={styles['leave-review-btn']}
                        onClick={() => setReviewModal(true)}
                      >
                        Send Feedback
                      </button>
                    </div>
                  )}
                  {reviewModal && (
                    <CourseReviewModal 
                      setReviewModal={setReviewModal} 
                      onReviewSent={async () => {
                        const courseData = await getFullDetailsOfCourse(courseEntireData._id, token, null);
                        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
                        dispatch(setEntireCourseData(courseData.courseDetails));
                      }}
                    />
                  )}

                </>
              )}

              {courseSectionData &&
                courseSectionData.map((item, elemIndex) => (
                  <div className={styles['overview-inner']} key={elemIndex}>
                    <p className={styles['overview-heading']}>{item.sectionName}</p>

                    {item.subSection.map((content, index) => {
                      const isCompleted = isLectureCompleted(completedLectures, content._id, homeworks);
                      const isAccessible = isLectureAccessible(item, index, courseSectionData);
                      const hasHomework = content.homeworks && content.homeworks.length > 0;
                      const homeworkStatus = homeworks?.[content._id]?.status;
                      const score = homeworks?.[content._id]?.score || 0;
                      const needsResubmission = content.requiresHomeworkCheck && homeworkStatus === 'resubmission' && score < content.minScore;
              
                      
                      
                      
                      return (
                        <div
                          className={[
                            styles['overview-item'],
                            isCompleted && styles['inactive'],
                            content._id === subSectionId && styles['current-lesson'],
                            !isAccessible && styles['disabled'],
                            homeworkStatus === 'resubmission' && styles['resubmission'],
                            needsResubmission && styles['resubmission'],
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          key={content._id}
                          onClick={() => {
                            if (isAccessible) {
                              navigate(
                                `/view-course/${courseEntireData?._id}/section/${item?._id}/sub-section/${content?._id}`
                              );
                            }
                          }}
                        >
                          <p className={[styles['overview-item-title'], (hasHomework && isAccessible) && styles['has-homework']]
                            .filter(Boolean)
                            .join(' ')}
                          >{content.title}</p>

                          {(isCompleted || homeworkStatus === 'resubmission') && (
                            <div className={`checkbox-container ${styles['lecture-status']}`}>
                              {homeworkStatus === 'resubmission' ? (
                                <>
                                <div className={styles['status-score']}>
                                    <p className={styles.resubmission}>Resubmission needed</p>
                                    {needsResubmission && (
                                      <p className={styles.resubmission}>
                                        (Your score: {score} / Min score:{content.minScore ?? "-"})
                                      </p>
                                    )}
                                    </div>
                                  <input
                                    type="checkbox"
                                    className="custom-checkbox resubmission-checkbox"
                                    checked={false}
                                    readOnly
                                    id={`resub-${content._id}`}
                                  />
                                  <label htmlFor={`resub-${content._id}`}></label>
                                </>
                              ) : (
                                <>
                                  <div className={styles['status-score']}>
                                    <p>Completed</p>
                                    {content.requiresHomeworkCheck && (
                                      <p>
                                        (Your score: {score} / {content.maxScore ?? "-"})
                                      </p>
                                    )}
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={true}
                                    readOnly
                                    id={`done-${content._id}`}
                                  />
                                  <label htmlFor={`done-${content._id}`}></label>
                                </>
                              )}
                            </div>
                          )}


                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <>
            <div className={styles['overview-wrapper']}>
              {courseSectionData &&
              courseSectionData.map((item, elemIndex) => (
                <div className={styles['overview-inner']} key={elemIndex}>
                  <p className={styles['overview-heading']}>{item.sectionName}</p>
                  {item.subSection.map((content, index) => {
                    const key = `${elemIndex}-${index}`;
                    return (
                      <div
                        className={styles['overview-item']}
                        key={index}
                        onClick={() => handleTextOpened(elemIndex, index)}
                      >
                        <p className={styles['overview-item-title']}>{content.title}</p>
                        <AnimatePresence>
                          {visibleItems[key] && (
                            <motion.p
                              className={styles['overview-item-text']}
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {content.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {loading ? (
                <Loader/>
              ) : allStudents?.length === 0 ? (
                <p>
                    No Data Available
                </p>
              ) : (
                <div id="reviews-section">
                  {courseEntireData?.ratingAndReviews.length > 0 ? (
                      <h2 className={styles[`reviews-title`]}>Reviews about this course</h2>
                  ): (
                    <h3 className={styles[`reviews-title`]}>This course have any review yet.</h3>
                  )}
                  
                  <div className={styles.reviewsWrapper}>
                    {(courseEntireData?.ratingAndReviews ?? []).map((review) => {
                      const student = getStudentById(review.user, allStudents);
                      
                      return (
                        <div key={review._id} className={styles.reviewCard}>
                          {student ? (
                            <div className={styles['rewiever-info']}>
                              <div>
                                {student.image && <img className={styles.avatar} src={student.image} alt={`${student.firstName} avatar`} />}
                                <small>User: {student.firstName} {student.lastName}</small>   
                              </div>
                              <div className={styles.rating}>
                                <RatingStars Review_Count={Number(review.rating)} Star_Size={18} />
                                <span className={styles.ratingNumber}>{review.rating}/5</span>
                              </div>
                            </div>
                          ) : (
                            <p>User: Unknown User</p>
                          )}
                          
                          <p className={styles.reviewText}>" {review.review} "</p>
                        </div>
                      );
                    })}

                  </div>
                </div>
              )
              }
          </>)}
      </>
    );

}

export default CourseOverview;
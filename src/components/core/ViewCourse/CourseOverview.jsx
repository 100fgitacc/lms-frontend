import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
// import ProgressBar from 'components/progress-bar';
import styles from '../../../pages/coursePage.module.css'
import {
  setCourseSectionData
} from "../../../slices/viewCourseSlice"
import { getFullDetailsOfCourse } from "../../../services/operations/courseDetailsAPI"
import { getHomeworkBySubSection } from '../../../services/operations/studentFeaturesAPI';

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
        const courseData = await getFullDetailsOfCourse(courseEntireData._id, token);
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

    const completedCount = completedLectures.filter(lecture =>
      currentLessonIds.has(lecture.subSectionId)
    ).length;

    const allLessonsCompleted = totalLessons > 0 && completedCount === totalLessons;


    
    
    
    const isLectureCompleted = (completedLectures, subSectionId, homeworks) => {
        const id = subSectionId.toString();
        const isWatched = completedLectures.some(lec =>
            typeof lec === 'string'
            ? lec === id
            : lec.subSectionId?.toString() === id
        );

    const isReviewed = homeworks?.[id]?.status === 'reviewed';

    return isWatched || isReviewed;
    };

    const [isAccordionCollapsed, setIsAccordionCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    
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
            <div className={styles['course-finished-banner']}>
              🎉 Congratulations! 🎉 You've completed this course! Great job!
            </div>
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
                  
                  return (
                    <div
                      className={[
                        styles['overview-item'],
                        isCompleted && styles['inactive'],
                        content._id === subSectionId && styles['current-lesson'],
                        !isAccessible && styles['disabled'],
                        homeworkStatus === 'resubmission' && styles['resubmission'],
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
                      <p className={[styles['overview-item-title'], hasHomework && styles['has-homework']]
                        .filter(Boolean)
                        .join(' ')}
                      >{content.title}</p>

                     {(isCompleted || homeworkStatus === 'resubmission') && (
                        <div className={`checkbox-container ${styles['lecture-status']}`}>
                          {homeworkStatus === 'resubmission' ? (
                            <p className={styles.resubmission}>You have feedback from teacher</p>
                          ) : (
                            <>
                              <div className={styles['status-score']}>
                                
                                <p>Lesson Completed</p>
                                {content.requiresHomeworkCheck && homeworks?.[content._id]?.status === "reviewed" && (
                                  <p>
                                    (Your score: {homeworks[content._id]?.score ?? 0} / {content.maxScore ?? "-"})
                                  </p>
                                )}  
                              </div>
                              <input
                                type="checkbox"
                                className="custom-checkbox"
                                checked={true}
                                readOnly
                              />
                              <label htmlFor="customCheckbox"></label>
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
    )}
  </>
);

}

export default CourseOverview;
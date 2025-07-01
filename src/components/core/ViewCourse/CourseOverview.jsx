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

    const completedCount = completedLectures.length;

    const allLessonsCompleted = totalLessons > 0 && completedCount === totalLessons;

    
    
    const isLectureCompleted = (completedLectures, subSectionId) => {
        return completedLectures.some(lecture =>
            typeof lecture === 'string'
            ? lecture === subSectionId
            : lecture.subSectionId === subSectionId
        );
    };


    
    return(
        <>
        {
            content !== 'course-overview' ? (
                <div className={`${styles['overview-wrapper']} ${styles['single-course']}`}>
                <>
                    <button className={styles['back-to-button']} onClick={() => { navigate(`/dashboard/enrolled-courses`) }}>Back to courses</button>
                    <div className={`${styles['header-image'] }`}>
                        <h1 className={`${styles.title} main-title`}>{courseEntireData?.courseName}</h1>
                    </div>
                    {allLessonsCompleted && (
                        <div className={styles['course-finished-banner']}>
                            🎉 Congratulations! 🎉 You've completed this course! Great job!
                        </div>
                    )}
                    <div className={styles['header-info']}>
                        <div className={styles.desc}>
                            {/* <ProgressBar progress={data.progress}/> */}
                        </div>
                        {/* <div className={styles.activity}>
                            <img src='../assets/img/icons/timer.png' alt='timer icon'/>
                            <p>Last activity: 04.10.24</p>
                        </div> */}
                    </div>
                </>
                {courseSectionData &&  (
                    courseSectionData?.map((item, elemIndex)=>(
                        <div className={styles['overview-inner']} key={elemIndex}>  
                            <p className={styles['overview-heading']}>  
                                {item.sectionName}
                            </p>
                            {
                                item.subSection.map((content, index)=>{
                                   
                                    
                                    return(
                                   <div 
                                className={`
                                    ${styles['overview-item']} 
                                    ${isLectureCompleted(completedLectures, content._id) && styles['inactive']}
                                    ${content._id === subSectionId && styles['current-lesson']} 
                                    ${!isLectureAccessible(item, index, courseSectionData) ? styles['disabled'] : ''}
                                `} 
                                key={content._id}
                                onClick={() => {
                                    if (isLectureAccessible(item, index, courseSectionData)) {
                                    navigate(`/view-course/${courseEntireData?._id}/section/${item?._id}/sub-section/${content?._id}`)
                                    }
                                }}
                                >

                                        <p className={styles['overview-item-title']}>{content.title}</p>
                                         {(isLectureCompleted(completedLectures, content._id) || homeworks[content._id]?.status === 'reviewed') && (
                                            <div className={`checkbox-container  ${styles['lecture-status']}`}>
                                                <p>Lesson Completed</p>
                                                <input 
                                                type="checkbox" 
                                                className={`custom-checkbox`} 
                                                checked={true}
                                                readOnly
                                                />
                                                <label htmlFor="customCheckbox"></label>
                                            </div>
                                            )}

                                        </div>
                                    )
                                })
                            }
                            
                        
                        </div>
                    ))
                )}
            </div>
            ) : (
            <div className={styles['overview-wrapper']}>
                {courseSectionData &&  (
                    courseSectionData?.map((item, elemIndex)=>(
                        <div className={styles['overview-inner']} key={elemIndex}>  
                            <p className={styles['overview-heading']}>  
                                {item.sectionName}
                            </p>
                            {
                                item.subSection.map((content, index)=>{
                                    const key = `${elemIndex}-${index}`;
                                    return(
                                        <div 
                                        className={`${styles['overview-item']}`} key={index} 
                                        onClick={()=>{
                                            handleTextOpened(elemIndex, index);
                                        }
                                        }
                                        >  
                                        <p className={styles['overview-item-title']}>{content.title}</p>
                                            <AnimatePresence>
                                                {visibleItems[key] && (
                                                    <motion.p
                                                        className={styles['overview-item-text']}
                                                        initial={{ opacity: 0, height: 0, marginTop:0 }}
                                                        animate={{ opacity: 1, height: 'auto', marginTop:10  }}
                                                        exit={{ opacity: 0, height: 0, marginTop:0  }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                    {content.description}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )
                                })
                            }
                            
                        
                        </div>
                    ))
                )}
            </div>
            )
        } 
        </>   
    

        
    );
}

export default CourseOverview;
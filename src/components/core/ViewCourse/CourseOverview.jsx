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

const CourseOverview  = ({content}) => {

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
    

    const { subSectionId } = useParams();

    useEffect(() => {
    if (!courseEntireData?._id || !token) return;

    (async () => {
        const courseData = await getFullDetailsOfCourse(courseEntireData._id, token);
        if (courseData?.courseDetails?.courseContent) {
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        }
    })()
    }, [completedLectures, courseEntireData?._id, token]);


    const entireState = useSelector(state => state);
    console.log(entireState);

    const userId = useSelector(state => state.profile.user._id);
    const isUserEnrolled = courseEntireData?.studentsEnrolled?.some(enrollment => enrollment.user === userId);
    console.log(isUserEnrolled);
    
    // Функция проверки доступности лекции
    const isLectureAccessible = (section, lessonIndex) => {
    if (!isUserEnrolled) return false; // Если не записан — доступ запрещён

    const lesson = section.subSection[lessonIndex];

    if (lesson.allowSkip) return true; // Если урок можно пропускать — всегда доступен

    if (lessonIndex === 0) return true; // Первый урок доступен

    // Иначе доступ если предыдущий урок пройден
    const prevLesson = section.subSection[lessonIndex - 1];
    return completedLectures.includes(prevLesson._id);
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
                                    const accessible = isLectureAccessible(item, index);
                                    console.log(content.allowSkip);
                                    
                                    return(
                                       <div 
                                    className={`${styles['overview-item']} 
                                        ${completedLectures.includes(content?._id) && styles['inactive']}
                                        ${content._id === subSectionId && styles['current-lesson']} 
                                        ${!accessible ? styles['disabled'] : ''}
                                    `} 
                                    key={index}
                                    onClick={() => {
                                        if (accessible) {
                                        navigate(`/view-course/${courseEntireData?._id}/section/${item?._id}/sub-section/${content?._id}`)
                                        }
                                    }}
                                    >  
                                            <p className={styles['overview-item-title']}>{content.title}</p>
                                            {completedLectures.includes(content?._id) && (
                                                <div className={`checkbox-container  ${styles['lecture-status']}`}>
                                                    <p>Lesson Completed</p>
                                                    <input 
                                                    type="checkbox" 
                                                    id="customCheckbox" 
                                                    className={`custom-checkbox`} 
                                                    checked={completedLectures.includes(content?._id)}
                                                    onChange={() => { }}/>
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
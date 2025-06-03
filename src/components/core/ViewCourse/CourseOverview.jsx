import React, { useState } from 'react';
// import styles from './coursePage.module.css';
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
// import { resetExplore } from '../../store';
// import ProgressBar from 'components/progress-bar';
import styles from '../../../pages/coursePage.module.css'



const CourseOverview  = ({content}) => {
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
    

    const handleExploreClick = () => {
        dispatch(resetExplore());
        
    };
    const navigate = useNavigate()

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
                                    // const key = `${elemIndex}-${index}`;
                                    return(
                                        <div 
                                        className={`${styles['overview-item']} 
                                        ${completedLectures.includes(content?._id) && styles['inactive']}`} key={index} 
                                        onClick={()=>{
                                            // handleTextOpened(elemIndex, index);
                                            navigate(`/view-course/${courseEntireData?._id}/section/${item?._id}/sub-section/${content?._id}`)
                                        }
                                        }

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
                                            {/* <AnimatePresence>
                                                {visibleItems[key] && (
                                                    <motion.p
                                                        className={styles['overview-item-text']}
                                                        initial={{ opacity: 0, height: 0, marginTop:0 }}
                                                        animate={{ opacity: 1, height: 'auto', marginTop:10  }}
                                                        exit={{ opacity: 0, height: 0, marginTop:0  }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                    
                                                    </motion.p>
                                                )}
                                            </AnimatePresence> */}
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
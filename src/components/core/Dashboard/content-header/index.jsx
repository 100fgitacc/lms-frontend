// NotFoundPage.js
import React, { useState } from 'react';
import styles from './index.module.css';
import ProgressBar from '../progress-bar';
// import { showToast } from '../toast-сonfig';
import { useSelector, useDispatch } from "react-redux"
import Img from '../../../common/Img';
// import { setExplore } from '../../store';

import { formattedDate } from '../../../../utils/dateFormatter';

const ContentHeader = ({ page, content }) => {

    
    const [coursesState, setCoursesState] = useState({
    isStarted: Boolean(content?.isStarted)
    });

    const handleCourseSubmit = (index) =>{
        setCoursesState(prevCourses => ({
            ...prevCourses,
            isStarted: true 
        }))
        // showToast(`You are was submited to course "${content.name}"`);
    }
    const dispatch = useDispatch();

    const [lesson, setLesson] = useState(null);

    const handleExploreClick = (lesson) => {
        dispatch(setExplore());
        setLesson(lesson);
        
    };


    const { user } = useSelector((state) => state.profile)

    
    return (
        <>
        {page === 'Account' || page === 'Courses' || page === 'Projects' || page === 'Myfeed' || page === 'Wallets' ? (
                <div className={`${styles.wrapper} ${styles.profile}`}>
                    <div className={`${styles['header-image'] }`}></div>
                    <div className={styles['header-info']}>
                        <div className={styles.avatar}>
                            <Img src={user?.image} alt={`profile-${user?.firstName}`}/>
                        </div>
                        <div className={styles.desc}>
                            <h2 className={`${styles.title} secondary-title`}>{user?.firstName + " " + user?.lastName}</h2>
                            <div>
                                <div className={styles['sub-info']}>
                                    <p className={styles.role}>{user?.accountType}</p>
                                    <p className={styles.date}>{formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth"}</p>
                                    {/* <div className={styles.country}>
                                        <img src='../assets/img/icons/usa.png' alt='usa icon'/>
                                        <p>USA</p>
                                    </div>
                                    <p className={styles.status}>Active now</p> */}
                                </div>
                            
                                {/* <div className={styles.rate}>
                                    <div className={styles.name}>
                                        <img src='../assets/img/icons/moon.png' alt='moon icon'/>
                                        <p>Moon</p>
                                    </div>
                                    <p className={styles.count}>#1</p>
                                </div> */}
                            </div>
                            
                        </div>
                    </div>
                </div>
            ):
            page === 'course-purchased' ? (
                <div className={`${styles.wrapper} ${styles.course} ${styles['course-purchased']}`}>
                    <div className={`${styles['header-image'] }`}>
                        <p className={`${styles.subtitle}`}>Lesson 1</p>
                        <h1 className={`${styles.title} main-title`}>{lesson && lesson[0].heading}</h1>
                    </div>
                </div>
            ) : page === 'course' ? (
                    <div className={`${styles.wrapper} ${styles.course}`}>
                        <div className={`${styles['header-image'] }`}>
                            <h1 className={`${styles.title} main-title`}>{content.name}</h1>
                            <p className={`${styles.subtitle}`}>{content.desc}</p>
                        </div>
                        <div className={styles['header-info']}>
                            <div className={styles.desc}>
                                <ProgressBar progress={content.progress}/>
                            </div>
                            <div className={styles.activity}>
                                <img src='../assets/img/icons/timer.png' alt='timer icon'/>
                                <p>Last activity: 04.10.24</p>
                            </div>
                        </div>
                        <div className={styles['course-info']}>
                            <div>
                                <p>{content.membersCount} members</p>
                                <p>{content.price !== 0 ? content.price : 'Free'}</p>
                            </div>

                            {coursesState.isStarted ? (
                                    <button className={`${styles['start-course-success']} button-success`} onClick={()=>handleExploreClick([content.overview[0]])}>Explore the course!</button>
                                ):(
                                    <button className={`${styles['start-course']} button-primary`} onClick={()=>handleCourseSubmit(0)}>Start course</button>
                                )}
                            <h3 className={styles['third-title']}>Course includes</h3>
                            <div>
                                <img src='../assets/img/icons/book.png' alt='book icon'/>
                                <p>{content.lessonsCount} lessons</p>
                            </div>
                        </div>
                    </div>
                ) :  (
                    <div className={`${styles.wrapper} ${styles.feed}`}>
                        <div className={`${styles['header-image'] }`}></div>
                        <div className={styles['header-info']}>
                            <div className={styles.avatar}>
                                <img src='../assets/img/project.png' alt='avatar'/>
                            </div>
                            <div className={styles.desc}>
                                <div>
                                    <h2 className={`${styles.title} secondary-title`}>Crypto Project</h2>
                                    <div className={styles.socials}>
                                        <a href='https://100f.com/' target='_blank'>
                                            <img src='../assets/img/icons/ant-design_youtube-filled.png' alt='youtube icon'/>
                                        </a>
                                        <img src='../assets/img/icons/ant-design_github-outlined.png' alt='github icon'/>
                                        <a href='https://x.com/crypto100f' target='_blank'>
                                            <img src='../assets/img/icons/ant-design_x-outlined.png' alt='x icon'/>
                                        </a>
                                        <img src='../assets/img/icons/ic_baseline-discord.png' alt='discord icon'/>
                                        <img src='../assets/img/icons/bxl_telegram.png' alt='telegram icon'/>
                                        <a href='https://www.linkedin.com/company/100f'>
                                            <img src='../assets/img/icons/mdi_linkedin.png' alt='linkedin icon'/>
                                        </a>
                                        <a href='https://100f.com/' target='_blank'>
                                            <img src='../assets/img/icons/streamline_web-solid.png' alt='streamline icon'/>
                                        </a>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className={styles['sub-info']}>
                                        <p className={styles.activity}>Public | Active 2 weeks ago</p>
                                        <p className={styles.text}>
                                        Crypto Project is a cutting-edge cryptocurrency project focused on integrating solar energy solutions with blockchain technology. It aims to create a decentralized platform that optimizes energy distribution and promotes sustainability through clean energy innovations
                                        </p>
                                    </div>
                                
                                </div>
                                
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default ContentHeader;

import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getHomeworkBySubSection } from "../../../services/operations/studentFeaturesAPI"




const PagePagination = ({ currPage, renderPageContent, currentSubSection, content }) => {

    const [activePage, setActivePage] = useState('Account');
    const [activeOptions, setActiveOptions] = useState('Table');
    const [activeSubOptions, setActiveSubOptions] = useState('Times');
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth)

    const handleMenuItemClick = (page) => {
        renderPageContent(page);
    };

    useEffect(() => {
        switch (currPage) {
            case 'Profile':
                setActivePage('Account');
                break;
            case 'single-course':
                setActivePage('Lesson');    
                break;
            case 'Feed':
                setActivePage('Feed');    
                break;
            case 'Manage':
                // setActivePage(isDashboard ? 'Dashboards': 'Details');    
                break;
            default:
            break
        }
     
    }, [currPage]);
    
    useEffect(() => {
        switch (content) {
            case 'Feed':
                setActivePage('Feed');
                break;
            case 'Investround':
                setActivePage('Investround');    
                break;
            case 'Airdrop':
                setActivePage('Airdrop');    
                break;
            case 'Details':
                setActivePage('Details');    
                break;
            default:
            break
        }
    }, [content]);


    const { courseId, sectionId, subSectionId } = useParams()
    const [homework, setHomework] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
          if (!courseId || !sectionId || !subSectionId) {
            navigate("/dashboard/enrolled-courses");
            return;
          }
        if (!user?._id) return;
          const homeworkData = await getHomeworkBySubSection(subSectionId, token, user._id);
          
          setHomework(homeworkData);
        };
        if(currentSubSection?.homeworks.length === 0){
            handleMenuItemClick('Lesson')
        }
        fetchData();
      }, [location.pathname]);
      
    
    
    return(
        <>
            {
                currPage === 'investor-project' ? (
                    <ul className={styles.wrapper}>
                    <li className={`${styles['pagination-item']} ${content === 'Feed' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Feed')}>
                        <p>Feed</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${content === 'Investround' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Investround')}>
                        <p>Investround</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${content === 'Airdrop' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Airdrop')}>
                        <p>Airdrop</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${content === 'Details' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Details')}>
                        <p>Details</p>
                    </li>
                </ul>
                ) :
                currPage === 'Profile' ? (
                    <ul className={styles.wrapper}>
                    <li className={`${styles['pagination-item']} ${content === 'Account' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Account')}>
                        <p>Account</p>
                    </li>
                    {/* <li className={`${styles['pagination-item']} ${content === 'Courses' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Courses')}>
                        <p>Courses</p>
                    </li> */}
                    {/* <li className={`${styles['pagination-item']} ${content === 'Projects' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Projects')}>
                        <p>Projects</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${content === 'Myfeed' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Myfeed')}>
                        <p>My feed</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${content === 'Wallets' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Wallets')}>
                        <p>Wallets</p>
                    </li> */}
                </ul>
                ) : currPage === 'single-course' ? (
                    <ul className={styles.wrapper}>
                        <li className={`${styles['pagination-item']} ${content === 'Lesson' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Lesson')}>
                            <img src='/assets/img/icons/file-video.png' alt='icon'/>
                            <p>Lesson & Materials</p>
                        </li>
                        {currentSubSection?.homeworks.length > 0 && (
                           <li
                            className={`${styles['pagination-item']} ${content === 'Homework' ? styles.active : ''}`}
                            onClick={() => handleMenuItemClick('Homework')}
                            >
                            <img src="/assets/img/icons/book-b.png" alt="icon" />
                            <p>Homework zone</p>

                            {homework?.status === "resubmission"   && (
                                <span className={styles['notification-indicator']}>!</span>
                            )}
                            </li>
                        )}
                        
                    </ul>
                ): currPage === 'Manage' && !context ? (
                    <ul className={styles.wrapper}>
                        <li className={`${styles['pagination-item']} ${content === 'Details' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Details')}>
                            <p>Details</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${content === 'Settings' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Settings')}>
                            <p>Settings</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${content === 'Dashboards' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Dashboards')}>
                            <p>Dashboards</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${content === 'Audience' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Audience')}>
                            <p>Audience calculator</p>
                        </li>
                    </ul>
                ): !currPage && context === 'audience-options' ? (
                    <ul className={styles.wrapper}>
                        <li className={`${styles['pagination-item']} ${activeOptions === 'Chart' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Chart')}>
                            <p>Chart</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activeOptions === 'Table' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Table')}>
                            <p>Table</p>
                        </li>
                    </ul>
                ): !currPage && context === 'audience-subOptions' ? (
                    <ul className={styles.wrapper}>
                        <li className={`${styles['pagination-item']} ${activeSubOptions === 'Times' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Times')}>
                            <p>Registration times</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activeSubOptions === 'Wallet' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Wallet')}>
                            <p>Wallet</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activeSubOptions === 'Passport' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Passport')}>
                            <p>Gitcoin Passport</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activeSubOptions === 'KYC' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('KYC')}>
                            <p>KYC</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activeSubOptions === 'Invested' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Invested')}>
                            <p>Invested projects</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activeSubOptions === 'Completed' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Completed')}>
                            <p>Completed projects</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activeSubOptions === 'Airdrop' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Airdrop')}>
                            <p>Airdrop points</p>
                        </li>
                    </ul>
                ): null
            }
        </>
    );
}

export default PagePagination;
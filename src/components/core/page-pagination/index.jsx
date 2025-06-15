import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { useSelector } from 'react-redux';
const PagePagination = ({currPage, renderPageContent, currentSubSection, content, context}) => {
    // const isDashboard = useSelector((state) => state.explore.isDashboard);
    const [activePage, setActivePage] = useState('Account');
    const [activeOptions, setActiveOptions] = useState('Table');
    const [activeSubOptions, setActiveSubOptions] = useState('Times');
    
    const handleMenuItemClick = (e) => {
        if (context ==='audience-options') {
            setActiveOptions(e);
            renderOptionsContent(e); 
        }else if (context ==='audience-subOptions') {
            setActiveSubOptions(e);
            renderSubOptionsContent(e); 
        }else if (context === 'Dashboards') {
            setActivePage('Dashboards');
        }else{
            setActivePage(e);
            renderPageContent(e);
        }
    
    }

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
    
    
    return(
        <>
            {
                currPage === 'investor-project' ? (
                    <ul className={styles.wrapper}>
                    <li className={`${styles['pagination-item']} ${activePage === 'Feed' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Feed')}>
                        <p>Feed</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${activePage === 'Investround' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Investround')}>
                        <p>Investround</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${activePage === 'Airdrop' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Airdrop')}>
                        <p>Airdrop</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${activePage === 'Details' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Details')}>
                        <p>Details</p>
                    </li>
                </ul>
                ) :
                currPage === 'Profile' ? (
                    <ul className={styles.wrapper}>
                    <li className={`${styles['pagination-item']} ${activePage === 'Account' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Account')}>
                        <p>Account</p>
                    </li>
                    {/* <li className={`${styles['pagination-item']} ${activePage === 'Courses' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Courses')}>
                        <p>Courses</p>
                    </li> */}
                    {/* <li className={`${styles['pagination-item']} ${activePage === 'Projects' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Projects')}>
                        <p>Projects</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${activePage === 'Myfeed' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Myfeed')}>
                        <p>My feed</p>
                    </li>
                    <li className={`${styles['pagination-item']} ${activePage === 'Wallets' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Wallets')}>
                        <p>Wallets</p>
                    </li> */}
                </ul>
                ) : currPage === 'single-course' ? (
                    <ul className={styles.wrapper}>
                        <li className={`${styles['pagination-item']} ${activePage === 'Lesson' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Lesson')}>
                            <img src='/assets/img/icons/file-video.png' alt='icon'/>
                            <p>Lesson & Materials</p>
                        </li>
                        {currentSubSection?.homeworks.length > 0 && (
                            <li className={`${styles['pagination-item']} ${activePage === 'Homework' ? styles.active : '' }`}  onClick={()=>handleMenuItemClick('Homework')}>
                                <img src='/assets/img/icons/book-b.png' alt='icon'/>
                                <p>Homework zone</p>
                            </li>
                        )}
                        
                    </ul>
                ): currPage === 'Manage' && !context ? (
                    <ul className={styles.wrapper}>
                        <li className={`${styles['pagination-item']} ${activePage === 'Details' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Details')}>
                            <p>Details</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activePage === 'Settings' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Settings')}>
                            <p>Settings</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activePage === 'Dashboards' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Dashboards')}>
                            <p>Dashboards</p>
                        </li>
                        <li className={`${styles['pagination-item']} ${activePage === 'Audience' ? styles.active : '' }`} onClick={()=>handleMenuItemClick('Audience')}>
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
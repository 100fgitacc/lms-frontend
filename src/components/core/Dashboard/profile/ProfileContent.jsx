import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { formattedDate } from '../../../../utils/dateFormatter';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';


import ProgressBar from '../progress-bar';
import FeedUi from '../feed-ui';
import { MdOutlineEdit } from "react-icons/md";
import styles from '../profile.module.css'

// import { showToast } from '../toast-сonfig';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import WalletPopup from 'components/popups/wallet-popup';
// import {setActiveMenuItem } from '../../store';

// const MySwal = withReactContent(Swal);

const ProfileContent = ({content}) => {
    const dispatch = useDispatch();
    // const showAlert = () => {
    //     MySwal.fire({
    //         showCloseButton: true, 
    //         showConfirmButton: false, 
    //         backdrop: true, 
    //         html: <WalletPopup/>,  
    //         customClass: {
    //             popup: 'wallet-popup-inner'
    //         },
    //         backdrop: `
    //             rgba(0, 0, 0, 0.8) 
    //         `,
    //     });
    // };

    const [coursesState, setCoursesState] = useState();

    const handleCourseSubmit = (index, name) =>{
        setCoursesState(prevCourses => {
            const updateCourses = [...prevCourses];
            updateCourses[index].isStarted  = true;
            return updateCourses
        })
        // showToast(`You have added to the course "${name}"`);
    }
    const [projectsState, setProjectsState] = useState();

    const handleProjectSubmit = (index, name) =>{
        setProjectsState(prevProjects => {
            const updateProjects = [...prevProjects];
            updateProjects[index].isMember  = true;
            return updateProjects
        })
        // showToast(`You have added to the Crypto Project "${name}"`);
    }

    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const [courses, setCourses] = useState([])

    useEffect(() => {
        if(user?.accountType === 'Instructor'){
            const fetchCourses = async () => {
            setLoading(true);
            const result = await fetchInstructorCourses(token)
            // console.log('Instructors all courses  ', result);
            setLoading(false);
            if (result) {
                setCourses(result)
            }
            }
            fetchCourses()
        }
        
    }, [])





    const { user } = useSelector((state) => state.profile)
    const navigate = useNavigate();

    return (
        <div className={styles['content-container']}>
            {
            content === 'Account' ? (
                <div className={styles['wrapper']}>
                    <div className={styles.heading}>
                        <h2 className={`${styles.title} secondary-title`}>About</h2>
                        <button className={`${styles['edit-btn']}`} onClick={() => { navigate("/dashboard/settings")}}>Edit profile
                            <MdOutlineEdit  className='btn-icon'/>
                        </button>
                    </div>
                    <div className={styles.about}>
                        <div className={styles['about-item']}>
                            <p>First Name:</p>
                            <p>{user?.firstName}</p>
                        </div>
                        <div className={styles['about-item']}>
                            <p>Last Name:</p>
                            <p>{user?.lastName}</p>
                        </div>
                        <div className={styles['about-item']}>
                            <p>Phone Number:</p>
                            <p>{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
                        </div>
                        <div className={styles['about-item']}>
                            <p>Email:</p>
                            <p>{user?.email}</p>
                        </div>
                        <div className={styles['about-item']}>
                            <p>Birthday:</p>
                            <p>{formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth"}</p>
                        </div>
                        {/* <div className={styles['about-item']}>
                            <p>Country</p>
                            <div className={styles['country-container']}>
                                <img src='../assets/img/icons/usa.png' alt='usa icon'/>
                                <p>USA</p>
                            </div>
                        </div> */}
                        <div className={styles['about-item']}>
                            <p>About:</p>
                            <p>{user?.additionalDetails?.about ?? "Write Something About Yourself"}</p>
                        </div>
                        <div className={styles['about-item']}>
                            <p>Gender:</p>
                            <p>{user?.additionalDetails?.gender ?? "Add Gender"}</p>
                        </div>
                        <div className={styles['about-item']}>
                            <p>Account Type:</p>
                            <p>{user?.accountType}</p>
                        </div>
                    </div>
                </div>

            ) : content === 'Courses' ? (
                <div className={styles['courses-wrapper']}>
                    {courses && courses.length > 0 && (
                        courses.map((course, index) => (
                        <div className={styles['courses-item']} key={index}>
                            <div className={styles['courses-image']}>
                                <span>{course.difficult}</span>
                                <img src={`../assets/img/${course.img}.png`} alt={course.name}/>
                            </div>
                            <div className={styles['courses-content']}>
                                <h3 className={styles['courses-title']}>
                                    {course.name}
                                </h3>
                                <div className={styles['courses-desc']}>
                                    {course.desc}
                                </div>
                                <div className={styles['progress-bar-wrapper']}>
                                    <ProgressBar  progress={course.progress}/>
                                </div>
                                {course.isStarted ? (
                                    <Link to='/course' className='button-success' >Explore the course</Link>
                                ):(
                                    <button className='button-primary' onClick={()=>handleCourseSubmit(index, course.name)}>Submit an application</button>
                                )}
                                
                            </div>
                        </div>
                        ))
                    )
                    }
                </div>
               
            ) : null
            // : content === 'Projects' ? (
            //     <div className={styles['projects-wrapper']}>
            //         {projects && projects.length > 0 && (
            //             projects.map((project, index) => {
            //                 const courseName = project.name.replace(/\s+/g, '-');
            //                 return(
            //                     <div className={styles['projects-item']} key={index}>
            //                         <div className={styles['projects-image']}>
            //                             <span>{project.type}</span>
            //                             <img src={`../assets/img/${project.img}.png`} alt={project.name}/>
            //                         </div>
            //                         <div className={styles['projects-content']}>
            //                             <h3 className={styles['projects-title']}>
            //                                 {project.name}
            //                             </h3>
            //                             <div className={styles['projects-desc']}>
            //                                 <p>{`${project.active ? `Active ${project.active} weeks ago` : 'Inactive'}`}</p>
            //                                 <p>{`${project.isPublic ? 'Public' : 'Private'}`}</p>
            //                             </div>
            //                             {project.isMember ? (
            //                                 <div>
            //                                     <Link to={`/investor/${courseName}`}
            //                                 onClick={()=>dispatch(setActiveMenuItem('investor-project'))} className='button-success'>Member</Link> 
            //                                 </div>
            //                             ):(
            //                                 <button className='button-primary' onClick={()=>handleProjectSubmit(index, project.name)}>Submit an application</button>
                                          
            //                             )}
                                        
            //                         </div>
            //                     </div>
            //                     )
            //             })
            //         )
            //         }
            //     </div>
            // ) : content === 'Myfeed' ? (
            //    <FeedUi feeds={feeds}/>
            // ) : content === 'Wallets' ? (
            //     <div className={styles['wallets-wrapper']}>
            //         <h2 className={`${styles.title} secondary-title`}>Wallets</h2>
            //         <div className={styles.about}>
            //             <div className={styles['wallets-item']}>
            //                 <img src={'../assets/img/icons/wallet1.png'} alt='EVM'/>
            //                 <p>EVM (ERC20, BSC20, etc.)</p>
            //             </div>
            //             <div className={styles['wallets-item']}>
            //                 <img src={'../assets/img/icons/wallet2.png'} alt='Solana'/>
            //                 <p>Solana</p>
            //             </div>
            //             <div className={styles['wallets-item']}>
            //                 <img src={'../assets/img/icons/wallet3.png'} alt='TRC20'/>
            //                 <p>TRC20</p>
            //             </div>
            //             <button className={`${styles['wallet-btn']} button-primary` } onClick={showAlert}>Connect wallet</button>
            //         </div>
            //     </div>
            // ) 
           
            }
        </div>
    );
};

export default ProfileContent;

// NotFoundPage.js
import React, { useState, useEffect  } from 'react';
import { FaShareSquare } from "react-icons/fa"
// import ProgressBar from 'components/progress-bar';
// import { showToast } from '../toast-сonfig';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom"
// import { setExplore } from '../../store';


import styles from './index.module.css';
import RatingStars from '../../common/RatingStars';
import { fetchCourseDetails } from "../../../services/operations/courseDetailsAPI"
import { ACCOUNT_TYPE } from './../../../utils/constants';
import { buyCourse } from "../../../services/operations/studentFeaturesAPI"


const ContentHeader = ({ page, content }) => {


  const { courseId, sectionId, subSectionId } = useParams()

  const courseStoreData = useSelector((state) => state.viewCourse?.courseEntireData); 
  const [courseEntireData, setCourseEntireData] = useState(null);

  useEffect(() => {
    if (courseStoreData) {
      setCourseEntireData(courseStoreData);
    }
  }, [courseStoreData]);
    

  const [coursesState, setCoursesState] = useState(content && content.isStarted ? content.isStarted : {});

    

  const handleCourseSubmit = (index) =>{
      setCoursesState(prevCourses => ({
          ...prevCourses,
          isStarted: true 
      }))
  }
  const dispatch = useDispatch();

  const [lesson, setLesson] = useState(null);

  const handleExploreClick = (lesson) => {
      dispatch(setExplore());
      setLesson(lesson);
      
  };
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)

  console.log(courseEntireData);
  const navigate = useNavigate()
 const handleBuyCourse = () => {
    if (token) {
      const coursesId = [courseId]
      buyCourse(token, coursesId, user, navigate, dispatch)
      setPayPalOn(true);
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }


   const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(response?.data.courseDetails))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }


  const [payPalOn, setPayPalOn] = useState(false);


    return (
        <>
          {
            content !== 'Single-course' ? (
             <>
              {courseEntireData && (
                <div className={`${styles.wrapper} ${styles.course} ${styles['course-purchased']}`}>
                    <div 
                    className={`${styles['header-image'] }`}
                    style={{ backgroundImage: `url(${courseEntireData?.thumbnail})` }}
                    >
                        {/* <p className={`${styles.subtitle}`}>{courseData.title}</p> */}
                        {/* <h1 className={`${styles.title} main-title`}>{lesson && lesson[0].heading}</h1> */}
                        <h1 className={`${styles.title} main-title`}>{courseEntireData?.courseName}</h1>
                        <p className={`${styles.subtitle}`}>{courseEntireData?.courseDescription}</p>
                    </div>
                </div>)
              }
             </>
            ): 
            ( <div className={`${styles.wrapper} ${styles.course} ${styles['course-overview']}`}>
                <div 
                className={`${styles['header-image'] }`}
                style={{ backgroundImage: `url(${courseEntireData?.thumbnail})` }}
                >
                  <h1 className={`${styles.title} main-title`}>{courseEntireData?.courseName}</h1>
                  <p className={`${styles.subtitle}`}>{courseEntireData?.courseDescription}</p>
                  
                </div>
                <div className={styles['header-info']}>
                  <div className={styles.desc}>
                     <div className={styles['course-rating']}>
                      {/* <RatingStars Review_Count={avgReviewCount} Star_Size={24}/> */}
                      <RatingStars Star_Size={24}/>
                      <span>{`(${courseEntireData?.ratingAndReviews?.length || 0} reviews)`}</span>
                      </div>
                  </div>
                  <div className={styles.activity}>
                    <img src='../assets/img/icons/timer.png' alt='timer icon'/>
                    <p>Last update: {`${new Date(courseEntireData?.updatedAt).toLocaleDateString()}`}</p>
                  </div>
                  <div className={styles['course-includes']}>
                    <div>
                      <img src='../assets/img/icons/book.png' alt='book icon' />
                      <p>{courseEntireData?.courseContent?.length || 0} modules</p>
                    </div>
                    <p>
                      {courseEntireData?.courseContent
                        ? courseEntireData.courseContent.reduce((total, section) => total + (section.subSection?.length || 0), 0)
                        : 0} lessons
                    </p>
                  </div>
                </div>
                <div className={styles['course-info']}>
                    

                     {/* <button className={`${styles['start-course-success']} button-success`} onClick={()=>handleExploreClick([content.overview[0]])}>Explore the course!</button> */}
                     
                      {!payPalOn ? (
                      <>
                       
                        <div className={` ${user?.accountType === ACCOUNT_TYPE.STUDENT && 'pt-5'} mt-7`}>
                          {
                            user?.accountType === ACCOUNT_TYPE.STUDENT && (
                            <>
                              <button
                              className={`${styles['start-course']} button-primary`}
                              onClick={
                                user && courseEntireData?.studentsEnrolled?.includes(user?._id)
                                  ? () => navigate("/dashboard/enrolled-courses")
                                  : handleBuyCourse
                              }
                            >
                              {user && courseEntireData?.studentsEnrolled?.includes(user?._id)
                                ? "Go To Course"
                                : "Buy Now"}
                              </button>
                                
                            </>
                            )
                          }
                          {(!user || courseEntireData?.studentsEnrolled?.includes(user?._id) && user?.accountType === ACCOUNT_TYPE.STUDENT) && (
                            <button onClick={handleAddToCart} >
                              Add to Cart
                            </button>
                          )}
                          <button onClick={handleShare} className={styles['share-btn']}>
                              <FaShareSquare size={15} /> <span>Share</span>
                            </button>
                        </div>
                        <h3 className={styles['third-title']}>Course instructions:</h3>
                        <div>
                          <p>
                            {(courseEntireData?.instructions || []).map((item, index) => (
                              <p className={styles['instructions']} key={index}>- {item}</p>
                            ))}
                              
                          </p>
                        </div>
                      </>
                      ) : (
                        <div id="paypal-button-container" ></div>
                      )}
                  
                </div>
              </div>
            )
          }
        </>
    );
};

export default ContentHeader;

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { TbListDetails } from "react-icons/tb";
// import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"
import Img from './../../common/Img';
import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"

import styles from './card.module.css'

function Course_Card({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0)

  
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  
 
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
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


  const cart = useSelector((state) => state.cart);
  

  const [isCourseInCart, setIsCourseInCart] = useState(false);

  const some = cart.cart.find(item => item._id === course._id);
 

  return (
    <div className={styles['courses-item']}>
       <Link to={`/courses/${course._id}`} className={styles['courses-image']}>
          <img
            src={course?.thumbnail}
            alt={course.name}
          />
        </Link>
          <div className={styles['courses-content']}>
            <div>
              <Link to={`/courses/${course._id}`}>
                <h3 className={styles['courses-title']}>{course?.courseName}</h3>
              </Link>
              <p className={styles.author}>{course?.instructor?.firstName}</p>
              <div className={styles['courses-desc']}>
                {course?.courseDescription}
              </div>
            </div>
              <div className={styles['rating-wrapper']}>
                <RatingStars Star_Size={15} Review_Count={avgReviewCount} />
                <strong>({ avgReviewCount || 0 })</strong>
              </div>
              <h4 className={styles.price}>{course?.price === 0 ? "Free" : `$${course?.price}`}</h4>
              <div className={styles['card-btns']}>
                <Link className={styles['details-link']} to={`/courses/${course._id}`} >
                  <TbListDetails className='react-icon' />
                  <p>Course details </p>
                </Link>
                {(!user || !course?.studentsEnrolled.includes(user?._id) && !some?._id && user?.accountType === ACCOUNT_TYPE.STUDENT) ? (
                  <button onClick={handleAddToCart} className={`button`} >
                    Add to Cart
                  </button>
                ) : some?._id === course._id && user?.accountType === ACCOUNT_TYPE.STUDENT? (<p className="">Already in Cart</p>): user?.accountType === ACCOUNT_TYPE.STUDENT ?(<p className="">Purchased</p>) : null
                }
              </div>
            
          </div>
      
     
    </div>
  )
}

export default Course_Card

import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { removeFromCart } from "../../../../slices/cartSlice"
import styles from '../profile.module.css'

export default function RenderCartCourses() {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  console.log(cart);
  
  return (
    <div>
      {cart.map((course, i) => (
        <div key={i}  className={styles['cart-course']}>
          <div className={styles['content']}>
            <Link to={`/courses/${course._id}`} className={styles['courses-image']}>
              <img
                src={course?.thumbnail}
                alt={course.name}
              />
            </Link>
            <div className={styles['description']}>
              <h4>
                {course?.courseName}
              </h4>
              <div className={styles['rating']}>
                <ReactStars
                  count={5}
                  value={course?.ratingAndReviews?.length}
                  size={15}
                  edit={false}
                  activeColor="#E7C009"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
              </div>
              <p className="">
              {course?.price === 0 ? "Free" : `$${course?.price}`}
              </p>
            </div>
          </div>
         
          <div className={styles['button-container']}>
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className={`button ${styles['cancel-button']}`}
            >
              Remove
              <RiDeleteBin6Line />
            </button>
            
          </div>
        </div>
      ))}
    </div>
  )
}
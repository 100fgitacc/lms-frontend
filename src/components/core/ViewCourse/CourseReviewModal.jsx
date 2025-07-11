import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"

import styles from './index.module.css'
import toast from "react-hot-toast"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm()


  const rating = watch("courseRating");

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
  }, [])

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    if (data.courseRating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <p className="modal-title">Add Review</p>
          <button onClick={() => setReviewModal(false)} className="modal-close-btn">
            <RxCross2 />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-form">
          <div className={styles['review-header']}>
            <div>
              <div className={styles.avatar}>
                <img
                  src={user?.image}
                  alt={`${user?.firstName} profile`}
                />
              </div>
              <p className={styles["truncate-name"]}>{user?.firstName} {user?.lastName}</p>
            </div>
            <div className="">
                <label className="label">Your Rating</label>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={24}
                  activeColor="#ffd700"
                />
              </div>
            </div>
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="form-group">
              <label htmlFor="courseExperience" className="label">
                Your Experience <sup>*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Describe your experience"
                {...register("courseExperience", { required: true })}
                className="textarea"
              />
              {errors.courseExperience && (
                <span className="required">Please add your experience</span>
              )}
            </div>

            <div className={styles['btns-container']}>
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="button cancel-button"
              >
                Cancel
              </button>
              <IconBtn text="Submit Review" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


import { useSelector } from "react-redux"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../../../services/formatDate"
import { deleteCourse, fetchInstructorCourses, } from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
import toast from 'react-hot-toast'
import { MdDeleteOutline,MdOutlinePeople, MdOutlinePendingActions } from 'react-icons/md';

import styles from '../profile.module.css'
import Loader from "../../../common/Loader"



export default function CoursesTable({ courses, setCourses, loading, setLoading }) {

  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 25

  // delete course
  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    const toastId = toast.loading('Deleting...')
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
    toast.dismiss(toastId)
  }


 

  

  return (
    <>
        {loading && (
          <Loader/>
        )}
        <div>
          {!loading && courses?.length === 0 ? (
            <p>
              No courses found
            </p>
          ) : (
            <div className={styles['courses-wrapper']}>
              {
                courses?.map((course) => {
                  const studentsCount = course?.studentsEnrolled?.length || 0;
                  const notReviewedCount = course?.notReviewedCount || 0; 
                  return(
                  <div key={course._id} className={styles['courses-item']}>
                    <div className={styles['courses-image']}>
                      <div className={styles['course-stats']}> 
                        <span><MdOutlinePeople /> {studentsCount} </span>
                        <span> | </span>
                        <span> {notReviewedCount} <MdOutlinePendingActions /></span>
                      </div>
                      <img src={course?.thumbnail} alt={course?.courseName}/>
                    </div>
                    <div className={styles['courses-content']}>
                      <a onClick={() => { navigate(`/dashboard/assignments/${course._id}`)}}>
                        <h3 className={styles['courses-title']}>{course.courseName}</h3>
                      </a>
                     
                      <div className={styles['courses-desc']}>
                        <p>
                          {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                          ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                          : course.courseDescription}
                        </p>
                      </div>
                      <div className={styles['adittional-info']}>
                        <p>
                          Created: {formatDate(course?.createdAt)}
                        </p>
                        <p className="">
                          Updated: {formatDate(course?.updatedAt)}
                        </p>
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <p className={styles.drafted}>
                            Drafted
                          </p>
                        ) : (
                          <div className={styles.published}>
                            Published
                          </div>
                        )}
                        <div className="">
                          <h3 className={styles.price}>{course.price} $</h3>
                          <div className={styles['course-manage']}>
                            <button
                                disabled={loading}
                                onClick={() => {
                                  navigate(`/dashboard/assignments/${course._id}`)
                                }}
                                title="Edit"
                                className={`button ${styles['assignments-btn']}`}
                              >Assignments</button>
                            <div>
                              <button
                                disabled={loading}
                                onClick={() => {
                                  navigate(`/dashboard/edit-course/${course._id}`)
                                }}
                                title="Edit"
                                className={styles['edit-btn']}
                              >Edit course
                              </button>
                              <button
                                disabled={loading}
                                onClick={() => {
                                  setConfirmationModal({
                                    text1: "Do you want to delete this course?",
                                    text2: "All the data related to this course will be deleted",
                                    btn1Text: !loading ? "Delete" : "Loading...  ",
                                    btn2Text: "Cancel",
                                    btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                                    btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                                  })
                                }}
                                title="Delete"
                                className={styles['delete-btn']}
                              ><MdDeleteOutline    /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )})
              }
            </div>
          )}
        </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}


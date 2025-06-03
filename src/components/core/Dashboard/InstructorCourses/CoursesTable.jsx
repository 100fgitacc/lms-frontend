
import { useDispatch, useSelector } from "react-redux"


import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import { deleteCourse, fetchInstructorCourses, } from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
import Img from './../../../common/Img';
import toast from 'react-hot-toast'

import styles from '../profile.module.css'



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

  // Loading Skeleton
  const skItem = () => {
    return (
      <div className="flex border-b border-richblack-800 px-6 py-8 w-full">
        <div className="flex flex-1 gap-x-4">
          <div className='h-[148px] min-w-[300px] rounded-xl skeleton'></div>

          <div className="flex flex-col w-[40%]">
            <p className="h-5 w-[50%] rounded-xl skeleton"></p>
            <p className="h-20 w-[60%] rounded-xl mt-3 skeleton"></p>

            <p className="h-2 w-[20%] rounded-xl skeleton mt-3"></p>
            <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
        {loading && (
          <div>
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}
        <div>
          {!loading && courses?.length === 0 ? (
            <p>
              No courses found
            </p>
          ) : (
            <div className={styles['courses-wrapper']}>
              {
                courses?.map((course) => (
                  <div key={course._id} className={styles['courses-item']}>
                    <div className={styles['courses-image']}>
                      <img src={course?.thumbnail} alt={course?.courseName}/>
                    </div>
                    <div className={styles['courses-content']}>
                      <h3 className={styles['courses-title']}>
                        {course.courseName}
                      </h3>
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
                            >Delete course
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}


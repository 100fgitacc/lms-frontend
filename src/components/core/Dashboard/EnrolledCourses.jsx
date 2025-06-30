import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import styles from './profile.module.css'
import Loader from '../../common/Loader';

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, [])

  

  // return if data is null
  if (enrolledCourses?.length == 0) {
    return (
      <p className="">
        You have not enrolled in any course yet.
      </p>)
  }



  return (
    <>
       <div className={styles.heading}>
            <h2 className={`${styles.title} secondary-title`}>Enrolled Courses</h2>
            <strong>
              {/* Total instructors: {instructorsCount} */}
            </strong>
          </div>
      {
        <>


          {/* loading Skeleton */}
          {!enrolledCourses && <Loader/>} 

          {/* Course Names */}
          <div className={styles['courses-wrapper']}>
            {enrolledCourses?.map((course, i, arr) => (
                <>
                  <div className={styles['courses-item']} onClick={() => { navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}} key={i}>
                    <div className={styles['courses-image']}>
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                      />
                    </div>
                    <div className={styles['courses-content']}>
                      <h3 className={styles['courses-title']}>{course.courseName}</h3>
                      <div>
                        <p className={styles['courses-desc']}>
                          {course.courseDescription.length > 50
                          ? `${course.courseDescription.slice(0, 50)}...`
                          : course.courseDescription}
                        </p>
                        <ProgressBar
                          completed={course.progressPercentage || 0}
                          height="4px"
                          isLabelVisible={false}
                          bgColor="#073FC2"
                        />
                        <div className={styles['course-info']}>
                          <p>Completed: {course.progressPercentage || 0}%</p>
                          <p>Duration: {course?.totalDuration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )).reverse()
            }
          </div>
        </>
      }
    </>
  )
}
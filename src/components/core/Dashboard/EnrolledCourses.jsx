import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import Img from './../../common/Img';

import styles from './profile.module.css'


export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      console.log(res);
      
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, [])

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-gray px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className='h-14 w-14 rounded-lg skeleton '></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    )
  }

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
          {!enrolledCourses && <div >
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
          </div>}

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
              ))
            }
          </div>
        </>
      }
    </>
  )
}
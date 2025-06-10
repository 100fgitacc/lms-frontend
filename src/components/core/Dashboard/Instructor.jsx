import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"
import { getAllStudentsByInstructorData } from "../../../services/operations/adminApi"


import styles from './profile.module.css'
import Loader from "../../common/Loader"


export default function Instructor() {
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

 const navigate = useNavigate()
  // get Instructor Data
  useEffect(() => {
    ; (async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      // console.log('INSTRUCTOR_API_RESPONSE.....', instructorApiData)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0)

  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)


  const [allStudentsDetails, setAllStudentsDetails] = useState([]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      const { allStudentsDetails} = await getAllStudentsByInstructorData(token);
      setAllStudentsDetails(allStudentsDetails);
      
    };
    fetchAllStudents();
    
  }, []);

 
  
  return (
    <div className={styles['content-container']} >
      {loading ? (
        <Loader type='fullscreen'/>
      )
        :
        courses.length > 0 ? (
        <>
          <div className={`${styles['wrapper']} ${styles['stats-wrapper']}`}>
            {/* Render chart / graph */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className={styles['wrapper']}>
                <p>Not Enough Data To Visualize</p>
              </div>
            )}
            {/* Total Statistics */}
            <div className={styles['wrapper']}>
              <h3 className={styles.heading}>Statistics:</h3>
              <p>Total Courses:  <strong>{courses.length}</strong></p>
              <p>Total Students: <strong>{totalStudents}</strong></p>
              <p>Total Income: <strong>{totalAmount} $</strong></p>
            </div>
          </div>
        
          {/* Render 3 courses */}
          <div className={styles['wrapper']}>
            <div className={styles.heading}>
              <h3>Last 5 Courses data</h3>
              <Link to="/dashboard/my-courses">
                <p className={styles.link}>
                  View All
                </p>
              </Link>
            </div>
            <div className={styles['courses-wrapper']}>
              {courses.slice(0, 5).map((course) => (
                <div className={styles['courses-item']} key={course._id} onClick={() => {navigate(`/dashboard/edit-course/${course._id}`)}}
>
                 <div className={styles['courses-image']}>
                   <img
                    src={course.thumbnail}
                    alt={course.courseName}
                  />
                 </div>
                  <div className={styles['courses-content']}>
                    <h3 className={styles['courses-title']}>
                      {course.courseName}
                    </h3>
                    <div>
                      <p className={styles['courses-desc']}>
                        {course.studentsEnrolled.length} students enrolled
                      </p>
                      <p>{course.price} $</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles['wrapper']}>
            <div className={styles.heading}>
              <h3>Last 3 Students data</h3>
              <Link to="/dashboard/all-students-by-instructor">
                <p className={styles.link}>
                  View All
                </p>
              </Link>
            </div>

           <div>
              {allStudentsDetails.slice(0, 3).map((student) => (
                <div key={student._id} className={styles.wrapper}>
                  <div className={styles['students-table-item']}>
                    <div>
                      <p className={styles.bold}>Student name:</p>
                      <p className={student.firstName}>{student.firstName}</p>
                    </div>
                    <div>
                      <p className={styles.bold}>Student email:</p>
                      <p>{student.email}</p>
                    </div>
                    <strong>
                      Total enrolled courses ({student.courses.length})
                    </strong>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Course Name</th>
                        <th>Start Date</th>
                        <th>Complete Date</th>
                        <th>Progress</th>
                        <th>Current Lesson</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.courses.map((course, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{course.courseName}</td>
                          <td>
                            {new Date(course.startedAt).toLocaleDateString()}
                          </td>
                          <td>
                            {course.completedAt
                              ? new Date(course.completedAt).toLocaleDateString()
                              : 'in process...'}
                          </td>
                          <td>{course.progressPercentage}%</td>
                          <td>
                            {course.currentSubSection?.title || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>


          </div>
        </>

        ) : (
          <div>
            <p>
              You have not created any courses yet
            </p>

            <Link to="/dashboard/add-course">
              <p>
                Create a course
              </p>
            </Link>
          </div>
        )}
    </div>
  )
}

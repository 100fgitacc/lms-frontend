import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate  } from "react-router-dom"
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import Loader from "../../../common/Loader"
import styles from './assignments.module.css'
import { getAllStudentsByInstructorData } from "../../../../services/operations/adminApi"

import Select from 'react-select'

const homeworkOptions = [
  { value: "all", label: "All Homework" },
  { value: "assigned", label: "Assigned" },
  { value: "not_assigned", label: "Not Assigned" },
]
const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "reviewed", label: "Reviewed" },
  { value: "not_reviewed", label: "Not Reviewed" },
  { value: "resubmission", label: "Resubmission Required" },
]


export default function AssignmentsCourse() {




  const { courseId} = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [coursesData, setCoursesData] = useState([])

  const [filterTitle, setFilterTitle] = useState("")
  const [filterHomework, setFilterHomework] = useState("all") 
  const [filterStatus, setFilterStatus] = useState("all")     

  const [openStudents, setOpenStudents] = useState({})

useEffect(() => {
  const fetchFullCourseDetails = async () => {
    setLoading(true)

    const allStudents = await getAllStudentsByInstructorData(token)

    if (allStudents?.allStudentsDetails) {
      const filteredStudents = allStudents.allStudentsDetails
        .map((student) => ({
          ...student,
          courses: student.courses.filter(course => course._id === courseId)
        }))
        .filter(student => student.courses.length > 0)

      setCoursesData(filteredStudents)

      const openState = {}
      filteredStudents.forEach(student => {
        openState[student._id] = true
      })
      setOpenStudents(openState)
    }

    setLoading(false)
  }

  fetchFullCourseDetails()
}, [courseId, token])

  const homeworkFilter = (homework) => {
    if (filterHomework === "all") return true
    if (filterHomework === "assigned") return homework === true
    if (filterHomework === "not_assigned") return homework === false
    return true
  }

  const statusFilter = (status) => {
    if (filterStatus === "all") return true
    if (filterStatus === "reviewed") return status === "Reviewed"
    if (filterStatus === "not_reviewed") return status === "Not Reviewed"
    if (filterStatus === "resubmission") return status === "Resubmission Required"
    return true
  }

  if (loading) {
    return <Loader type="fullscreen" />
  }

  const toggleStudentOpen = (studentId) => {
    setOpenStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
  }

  return (
    <>
      <h2 className={`secondary-title ${styles.heading}`}>Course Assignments</h2>
      <div className={styles.wrapper}>
        <div className={styles['assignments-management']}>
          <div>
            <div className={styles['filter-head']}>
              <p className={styles['filter-title']}>Filtered by:</p>
              <button
                className={`button ${styles['filter-button']}`}
                onClick={() => {
                  setFilterTitle("")
                  setFilterHomework("all")
                  setFilterStatus("all")
                }}
              >
                Clear filters
              </button>
            </div>
            <table className={styles.filter}>
                <thead>
                  <tr>
                    <th>Lesson title</th>
                    <th>Homework status</th>
                    <th>Lesson status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                    <input
                      type="text"
                      placeholder="Filter by Lesson Title"
                      value={filterTitle}
                      onChange={(e) => setFilterTitle(e.target.value)}
                    />
                    </td>
                    <td>
                      <Select
                        options={homeworkOptions}
                        value={homeworkOptions.find(opt => opt.value === filterHomework) || null}
                        onChange={opt => setFilterHomework(opt?.value ?? "all")}
                        isClearable={false}
                        placeholder="All Homework"
                        classNamePrefix="rs"
                        styles={{
                        control: (base) => ({
                          ...base,
                          cursor: 'pointer',
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      />
                    </td>
                    <td>
                      <Select
                        options={statusOptions}
                        value={statusOptions.find(opt => opt.value === filterStatus) || null}
                        onChange={opt => setFilterStatus(opt?.value ?? "all")}
                        isClearable={false}
                        placeholder="All Statuses"
                        classNamePrefix="rs"
                        styles={{
                        control: (base) => ({
                          ...base,
                          cursor: 'pointer',
                        }),
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      />
                    </td>
                  </tr>
                </tbody>
                </table>
           

            

            

            
          </div>

          <div className={styles['stats']}>
            <h3>Course stats:</h3>
            <p>Total Assignments Submitted: <span>1000</span></p>
            <p>Reviewed: <span>10</span></p>
            <p>Not Reviewed: <span>1020</span></p>
            <p>Resubmission Required: <span>190</span></p>
          </div>
        </div>

        {coursesData.map((student) => (
          <div key={student._id} className={` ${styles.wrapper}`}>
            <div 
              className={`${styles['student-data']}`}
              onClick={() => toggleStudentOpen(student._id)} 
            >
              <div className={`${styles['student-heading']}`}>
                <img src={student.image} alt="student" />
                <div>
                  <h5>Student: {student.firstName + " " + student.lastName}</h5>
                  <p>Email: {student.email}</p>
                </div>
              </div>
              {openStudents[student._id] ? <HiChevronUp  size={20}/> : <HiChevronDown size={20} />}
            </div>
            <div
              className={`${styles['accordion-content']} ${
                openStudents[student._id] ? styles.open : styles.closed
              }`}
            >
              {openStudents[student._id] && student.courses.map((course) => {
                const filteredLessons = course.courseContent.flatMap((section) =>
                  section.subSection.filter((lesson) => {
                    if (filterTitle && !lesson.title.toLowerCase().includes(filterTitle.toLowerCase())) {
                      return false
                    }
                    if (!homeworkFilter(lesson.homework)) {
                      return false
                    }
                    if (!statusFilter(lesson.status)) {
                      return false
                    }
                    return true
                  })
                )

                return (
                  <div key={course._id}>
                    <table className={styles['lesson-table']}>
                      <thead>
                        <tr>
                          <th>Lesson Title</th>
                          <th>Homework</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLessons.map((lesson) => (
                          <tr key={lesson._id} 
                           onClick={() =>
                            navigate(
                              `/dashboard/assignments/${courseId}/student/${student._id}/lesson/${lesson._id}`
                            )
                          }
                          >
                            <td>{lesson.title}</td>
                            <td>{lesson.homework ? "Assigned" : "Not Assigned"}</td>
                            <td>Not Reviewed</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

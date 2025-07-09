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
  { value: "homework_sent", label: "Homework Sent" },
  { value: "without_homework", label: "Without Homework" },
]
const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "reviewed", label: "Reviewed" },
  { value: "not_reviewed", label: "Not Reviewed" },
  { value: "resubmission", label: "Resubmission Required" },
  { value: "not_started", label: "Homework is not started" },
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
    if (filterHomework === "all") return true;
    if (filterHomework === "homework_sent") return homework?.answerText?.trim();
    if (filterHomework === "without_homework") return !homework?.answerText?.trim();
    return true;
  };

  const statusFilter = (status) => {
    if (filterStatus === "all") return true;
    return filterStatus === status;
  };

  if (loading) {
    return <Loader type="fullscreen" />
  }

  const toggleStudentOpen = (studentId) => {
    setOpenStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
  }

  
  const formatStatus = (status) => {
    switch (status) {
      case "reviewed": return "Reviewed"
      case "not_reviewed": return "Not Reviewed"
      case "resubmission": return "Resubmission Required"
      case "not_started": return "Not Started"
      default: return status
    }
  }

  let totalSubmitted = 0;
  let reviewed = 0;
  let notReviewed = 0;
  let resubmission = 0;
  let notStarted = 0;

coursesData.forEach((student) => {
  student.courses.forEach((course) => {
    const homeworks = course.homeworksBySubSection || {};
    course.courseContent.forEach(section => {
      section.subSection.forEach(lesson => {
        const hwArr = homeworks[lesson._id] || [];
        const hw = hwArr[0];

        if (!hw) {
          notStarted++;
          return;
        }

        if (hw.answerText?.trim()) {
          totalSubmitted++;
        }

        switch (hw.status) {
          case "reviewed":
            reviewed++;
            break;
          case "not_reviewed":
            notReviewed++;
            break;
          case "resubmission":
            resubmission++;
            break;
          case "not_started":
            notStarted++;
            break;
        }
      });
    });
  });
});
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
            <p>Total Assignments Submitted: <span>{totalSubmitted}</span></p>
            <p>Reviewed: <span>{reviewed}</span></p>
            <p>Not Reviewed: <span>{notReviewed}</span></p>
            <p>Resubmission Required: <span>{resubmission}</span></p>
            <p>Not Started: <span>{notStarted}</span></p>
          </div>
        </div>

        {coursesData
        .filter(student =>
          student.courses.some(course =>
            course.courseContent.some(section =>
              section.subSection.some(lesson => {
                const hwArr = course.homeworksBySubSection?.[lesson._id] || [];
                const homework = hwArr.length > 0 ? hwArr[0] : null;
                return (
                  (!filterTitle || lesson.title.toLowerCase().includes(filterTitle.toLowerCase())) &&
                  homeworkFilter(homework) &&
                  statusFilter(homework?.status || "not_started")
                );
              })
            )
          )
        )
        .map((student) => (
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
                    const hwArr = course.homeworksBySubSection?.[lesson._id] || [];
                    const homework = hwArr.length > 0 ? hwArr[0] : null;

                    if (filterTitle && !lesson.title.toLowerCase().includes(filterTitle.toLowerCase())) return false;
                    if (!homeworkFilter(homework)) return false;
                    if (!statusFilter(homework?.status || "not_started")) return false;

                    return true;
                  })
                );

                

                return (
                  <div key={course._id}>
                    <table className={styles['lesson-table']}>
                      <thead>
                        <tr>
                          <th>Lesson Title</th>
                          <th>Status</th>
                          <th>Student Sent homework </th>
                          <th>Delayed Check</th>
                          <th>Requires Homework Check</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLessons.map((lesson) => {
                            const hwArr = course.homeworksBySubSection?.[lesson._id] || [];
                            const homework = hwArr.length > 0 ? hwArr[0] : null;
                          return(
                            <tr key={lesson._id} 
                            onClick={() =>
                              navigate(
                                `/dashboard/assignments/${courseId}/student/${student._id}/lesson/${lesson._id}`
                              )
                            }
                            >
                              <td>{lesson.title}</td>
                              <td>
                                <span
                                  className={`${styles.badge} ${
                                    homework?.status === "reviewed"
                                      ? styles.reviewed
                                      : homework?.status === "not_reviewed"
                                      ? styles.notReviewed
                                      : homework?.status === "resubmission"
                                      ? styles.resubmission
                                      : styles.notStarted
                                  }`}
                                >
                                  {homework?.status ? formatStatus(homework.status) : "Not Started"}
                                </span>
                              </td>
                              <td>
                                {lesson.homeworks && lesson.homeworks.length > 0 ? (
                                  homework?.answerText?.trim() ? (
                                    <span className={`${styles.badge} ${styles.sent}`}>Already Sent</span>
                                  ) : (
                                    <span>Not Sent</span>
                                  )
                                ) : (
                                  "Lesson w/o homework"
                                )}
                              </td>
                              <td>
                                {lesson.delayedHomeworkCheck ? (
                                  <span>Delayed Check</span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {lesson.requiresHomeworkCheck ? (
                                  <span>Yes</span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {lesson.requiresHomeworkCheck ? (
                                  <span>
                                    {homework?.score ?? 0} / {lesson.maxScore ?? "-"}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          )
                        }
                        )}
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

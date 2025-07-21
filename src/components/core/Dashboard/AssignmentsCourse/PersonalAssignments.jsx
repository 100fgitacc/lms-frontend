import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { HiChevronDown, HiChevronUp } from "react-icons/hi"
import Loader from "../../../common/Loader"
import styles from "./assignments.module.css"
import { getAllStudentsByInstructorData } from "../../../../services/operations/adminApi"
import Select from "react-select"
import { getFullDetailsOfCourse, resetLessonProgress } from "../../../../services/operations/courseDetailsAPI"
import ConfirmationModal from "../../../common/ConfirmationModal"
import { setCourse } from "../../../../slices/courseSlice"

const homeworkOptions = [
  { value: "all", label: "All Homework" },
  { value: "homework_sent", label: "Homework Sent" },
  { value: "without_homework", label: "Not Sent" },
]

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "reviewed", label: "Reviewed" },
  { value: "not_reviewed", label: "Not Reviewed" },
  { value: "resubmission", label: "Resubmission Required" },
  { value: "not_started", label: "Not started" },
]
const completionOptions = [
  { value: "all", label: "All Lessons" },
  { value: "completed", label: "Completed" },
  { value: "not_completed", label: "Not Completed" },
]

export default function PersonalAssignments() {
  const { courseId, studentId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  
  const isCompleted = (lessonId, courseProgress) => {
    if (!courseProgress?.completedVideos) return false;

    return courseProgress.completedVideos.some(
      (item) => item.subSectionId?.toString() === lessonId
    );
  };


  const [loading, setLoading] = useState(false)
  const [coursesData, setCoursesData] = useState([])

  const [filterTitle, setFilterTitle] = useState("")
  const [filterHomework, setFilterHomework] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const [openStudents, setOpenStudents] = useState({})

 useEffect(() => {
  const fetchFullCourseDetails = async () => {
    setLoading(true)

    const data = await getFullDetailsOfCourse(courseId, token, studentId);
    
    if (data?.courseDetails) {
      const course = data.courseDetails;
      course.courseProgress = {
        completedVideos: data.completedVideos,
        allowedToSkip: data.allowedToSkip,
      };
      const filteredStudents = [
        {
          _id: studentId,
          courses: [course],
        },
      ];

      setCoursesData(filteredStudents);

      const openState = {};
      filteredStudents.forEach((student) => {
        openState[student._id] = true;
      });
      setOpenStudents(openState);
    }

    setLoading(false);
  };

  fetchFullCourseDetails();
}, [courseId, token, studentId]);


  const homeworkFilter = (homework) => {
    if (filterHomework === "all") return true
    if (filterHomework === "homework_sent") return homework?.answerText?.trim()
    if (filterHomework === "without_homework") return !homework?.answerText?.trim()
    return true
  }

  const statusFilter = (status) => {
    if (filterStatus === "all") return true
    return filterStatus === status
  }
  const [filterCompletion, setFilterCompletion] = useState("all");

  const formatStatus = (status) => {
    switch (status) {
      case "reviewed":
        return "Reviewed"
      case "not_reviewed":
        return "Not Reviewed"
      case "resubmission":
        return "Resubmission Required"
      case "not_started":
        return "Not Started"
      default:
        return status
    }
  }

  let totalSubmitted = 0
  let reviewed = 0
  let notReviewed = 0
  let resubmission = 0
  let notStarted = 0

  coursesData.forEach((student) => {
    student.courses.forEach((course) => {
      const homeworks = course.homeworksBySubSection || {}
      course.courseContent.forEach((section) => {
        section.subSection.forEach((lesson) => {
          const hwArr = homeworks[lesson._id] || []
          const hw = hwArr[0]

          if (!hw) {
            notStarted++
            return
          }

          if (hw.answerText?.trim()) {
            totalSubmitted++
          }

          switch (hw.status) {
            case "reviewed":
              reviewed++
              break
            case "not_reviewed":
              notReviewed++
              break
            case "resubmission":
              resubmission++
              break
            case "not_started":
              notStarted++
              break
          }
        })
      })
    })
  })


  
  const [confirmationModal, setConfirmationModal] = useState(null)

  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      const allStudents = await getAllStudentsByInstructorData(token);
      
      if (allStudents?.allStudentsDetails) {
        const student = allStudents.allStudentsDetails.find(s => s._id === studentId);
        
        setStudentInfo(student || null);
      }
    };

    fetchStudentInfo();
  }, [studentId, token]);

  if (loading) return <Loader type="fullscreen" />

  

  return (
    <>
      <h2 className={`secondary-title ${styles.heading}`}>Personal Assignments</h2>
      <div className={styles.wrapper}>
        <div className={styles["assignments-management"]}>
          <div className='table-wrapper filter-wrapper'>
            <div className={styles["filter-head"]}>
              <p className={styles["filter-title"]}>Filtered by:</p>
              <button
                className={`button ${styles["filter-button"]}`}
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
                  <th>Homework state</th>
                  <th>Homework status</th>
                  <th>Lesson Completion</th>
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
                      value={homeworkOptions.find((opt) => opt.value === filterHomework) || null}
                      onChange={(opt) => setFilterHomework(opt?.value ?? "all")}
                      isClearable={false}
                      classNamePrefix="rs"
                    />
                  </td>
                  <td>
                    <Select
                      options={statusOptions}
                      value={statusOptions.find((opt) => opt.value === filterStatus) || null}
                      onChange={(opt) => setFilterStatus(opt?.value ?? "all")}
                      isClearable={false}
                      classNamePrefix="rs"
                    />
                  </td>
                  <td>
                    <Select
                      options={completionOptions}
                      value={completionOptions.find((opt) => opt.value === filterCompletion) || null}
                      onChange={(opt) => setFilterCompletion(opt?.value ?? "all")}
                      isClearable={false}
                      classNamePrefix="rs"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.stats}>
            <h3>Course stats:</h3>
            <p>Homework Submitted: <span>{totalSubmitted}</span></p>
            <p>Homework Reviewed: <span>{reviewed}</span></p>
            <p>Homework Not Reviewed: <span>{notReviewed}</span></p>
            <p>Homework Resubmission Required: <span>{resubmission}</span></p>
            <p>Homework Not Started: <span>{notStarted}</span></p>
          </div>
        </div>
 
        

        {coursesData
        .filter((student) =>
          student.courses.some((course) =>
            course.courseContent.some((section) =>
              section.subSection.some((lesson) => {
                const hwArr = course.homeworksBySubSection?.[lesson._id] || []
                const homework = hwArr[0] || null
                return (
                  (!filterTitle || lesson.title.toLowerCase().includes(filterTitle.toLowerCase())) &&
                  homeworkFilter(homework) &&
                  statusFilter(homework?.status || "not_started")
                )
              })
            )
          )
        )
        .map((student) => {
          const isOpen = openStudents[student._id] || false;
          return (
            <div key={student._id} className={styles.wrapper}>
              <div
                className={styles["student-data"]}
                onClick={() => setOpenStudents(prev => ({ ...prev, [student._id]: !prev[student._id] }))}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div className={styles["student-heading"]} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src={studentInfo?.image} alt="student" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <h5>Student: {studentInfo?.firstName + " " + studentInfo?.lastName}</h5>
                    <p>Email: {studentInfo?.email}</p>
                  </div>
                </div>
                <div>
                  {isOpen ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
                </div>
              </div>

              <div className={`${styles["accordion-content"]} ${isOpen ? styles.open : styles.closed}`}>
                {isOpen && student.courses.map((course) => {
                  const filteredLessons = course.courseContent.flatMap((section) =>
                    section.subSection.filter((lesson) => {
                      const hwArr = course.homeworksBySubSection?.[lesson._id] || []
                      const homework = hwArr[0] || null

                      if (filterTitle && !lesson.title.toLowerCase().includes(filterTitle.toLowerCase())) return false
                      if (!homeworkFilter(homework)) return false
                      if (!statusFilter(homework?.status || "not_started")) return false
                      if (filterCompletion === "completed" && !isCompleted(lesson._id, course.courseProgress)) return false
                      if (filterCompletion === "not_completed" && isCompleted(lesson._id, course.courseProgress)) return false

                      return true
                    })
                  )

                  return (
                    <div key={course._id} className='table-wrapper'>
                      <table className={styles["lesson-table"]}>
                        <thead>
                          <tr>
                            <th>Lesson Title</th>
                            <th>Has Homework</th>
                            <th>Status</th>
                            <th>Student Sent Homework</th>
                            <th>Delayed Check</th>
                            <th>Requires Homework Check</th>
                            <th>Score</th>
                            <th>Completion</th>
                            <th>Manage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLessons.map((lesson) => {
                            const hwArr = course.homeworksBySubSection?.[lesson._id] || []
                            const homework = hwArr[0] || null
                            return (
                              <tr
                                key={lesson._id}
                                onClick={() =>
                                  navigate(`/dashboard/assignments/${courseId}/student/${student._id}/lesson/${lesson._id}`)
                                }
                              >
                                <td>{lesson.title}</td>
                                <td>{lesson.homeworks && lesson.homeworks.length > 0 ? "Yes" : "Lesson w/o homework"}</td>
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
                                  {homework?.answerText?.trim() ? (
                                    <span className={`${styles.badge} ${styles.reviewed}`}>Already Sent</span>
                                  ) : (
                                    <span className={`${styles.badge} ${styles.notStarted}`}>Not Sent</span>
                                  )}
                                </td>
                                <td>{lesson.delayedHomeworkCheck ? "Delayed Check" : "-"}</td>
                                <td>{lesson.requiresHomeworkCheck ? "Yes" : "-"}</td>
                                <td>
                                  {lesson.requiresHomeworkCheck ? (
                                    <span>{homework?.score ?? 0} / {lesson.maxScore ?? "-"}</span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td>
                                  {isCompleted(lesson._id, course.courseProgress) ? (
                                    <span className={`${styles.badge} ${styles.reviewed}`}>Completed</span>
                                  ) : (
                                    <span className={`${styles.badge} ${styles.notStarted}`}>Not Completed</span>
                                  )}
                                </td>
                                 <td className={styles.resetCell}>
                                <button
                                    className={styles.resetBtn}
                                    disabled={!isCompleted(lesson._id, course.courseProgress) && !homework?.answerText?.trim()}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setConfirmationModal({
                                        text1: "Reset progress and homework for this lesson?",
                                        btn1Text: "Yes, Reset",
                                        btn2Text: "Cancel",
                                        btn1Handler: async () => {
                                          const success = await resetLessonProgress(
                                            {
                                              courseId: course._id,
                                              subSectionId: lesson._id,
                                              studentId: student._id,
                                            },
                                            token
                                          )

                                          if (success) {
                                            const data = await getFullDetailsOfCourse(courseId, token, studentId);

                                            if (data?.courseDetails) {
                                              const course = data.courseDetails;
                                              course.courseProgress = {
                                                completedVideos: data.completedVideos,
                                                allowedToSkip: data.allowedToSkip,
                                              };
                                              const filteredStudents = [
                                                {
                                                  _id: studentId,
                                                  courses: [course],
                                                },
                                              ];

                                              setCoursesData(filteredStudents);
                                            }
                                          }

                                          setConfirmationModal(null);
                                        }
                                        ,
                                        btn2Handler: () => setConfirmationModal(null),
                                      })
                                    }}
                                  >
                                    Reset progress
                                  </button>
                              </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

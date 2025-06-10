import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from 'react-router-dom'
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import Loader from "../../../common/Loader"
import styles from './assignments.module.css'
import { getAllStudentsByInstructorData } from "../../../../services/operations/adminApi"


export default function StudentLesson() {

  const { courseId, studentId, lessonId } = useParams()
  const [loading, setLoading] = useState(true)
  const [lesson, setLesson] = useState(null)
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
   useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { allStudentsDetails } = await getAllStudentsByInstructorData(token)
      
      const student = allStudentsDetails.find(s => s._id === studentId)
      const course = student?.courses.find(c => c._id === courseId)
      const found = course?.courseContent
        .flatMap(sec => sec.subSection)
        .find(sub => sub._id === lessonId)
      setLesson(found || null)
      setLoading(false)
    }
    fetchData()
  }, [courseId, studentId, lessonId])



  if (loading) return <Loader type="fullscreen" />
  if (!lesson) return <p>Lesson not found</p>

  return (
    <>
      <h2 className={`secondary-title ${styles.heading}`}>Course Assignments</h2>
      <button onClick={() => navigate(-1)}>← Back to assignments</button>
      <h2>{lesson.title}</h2>
      <p><strong>Duration:</strong> {lesson.timeDuration} min</p>
      <p>{lesson.description}</p>
    </>
  )
}

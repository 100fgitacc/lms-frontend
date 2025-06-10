import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import CoursesTable from "./InstructorCourses/CoursesTable"
import { MdOutlineAddBox   } from "react-icons/md";

import styles from './profile.module.css'

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token)
      // console.log('Instructors all courses  ', result);
      setLoading(false);
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
  }, [])


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={`${styles.heading}`}>
          <h2 className={`${styles.title} secondary-title`}>My Courses</h2>
          <button className={`${styles['edit-btn']}`} onClick={() => navigate("/dashboard/add-course")}>Add New Course
             <MdOutlineAddBox     className='btn-icon'/>
          </button>
        </div>
        {courses && <CoursesTable courses={courses} setCourses={setCourses} loading={loading} setLoading={setLoading} />}
      </div>
      
    </div>
  )
}
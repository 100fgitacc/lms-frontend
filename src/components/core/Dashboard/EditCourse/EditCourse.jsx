import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { getFullDetailsOfCourse, } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"
import Loader from "./../../../common/Loader"




export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  // console.log('before course data = ', course)

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const fetchFullCourseDetails = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token);
      // console.log('Data from edit course file = ', result)
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    }

    fetchFullCourseDetails();
  }, [])

  // Loading
  if (loading) {
    return <Loader type='fullscreen' />
  }

  return (
    <div >

      <div>
        <h1>
          Edit Course
        </h1>

        {loading ? <Loader type='fullscreen' />
          :
          (<div>
            {course ? <RenderSteps />
              :
              (<p>
                Course not found
              </p>)
            }
          </div>)}
      </div>

    </div>
  )
}
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse, setStep, } from "../../../../../slices/courseSlice"

import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"


import styles from '../../profile.module.css'



export default function CourseBuilderForm() {
  const { register, handleSubmit, setValue, formState: { errors }, } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null) // stored section ID

  // handle form submission
  const onSubmit = async (data) => {
    // console.log("sent data ", data)
    setLoading(true)

    let result

    if (editSectionName) {
      result = await updateSection({ sectionName: data.sectionName, sectionId: editSectionName, courseId: course._id, }, token)
      // console.log("edit = ", result)
    } else {
      result = await createSection(
        { sectionName: data.sectionName, courseId: course._id, }, token)
    }
    // console.log("section result = ", result)
    if (result) {
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  // cancel edit
  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  // Change Edit SectionName
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  // go To Next
  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return;
    }
    if (course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add atleast one lecture in each section")
      return;
    }

    // all set go ahead
    dispatch(setStep(3))
  }

  // go Back
  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }
  return (
    <div className={styles['course-builder']}>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Section Name */}
        <div className={styles.row}>
          <div className={`${styles.col} ${errors.sectionName ? 'col-error' : ''}`}>
            <label className="" htmlFor="sectionName">
              Section Name <sup>*</sup>
            </label>
            {errors.sectionName && (
              <span className="required">
                Section name is required!
              </span>
            )}
            <input
              id="sectionName"
              disabled={loading}
              placeholder="Write section name and create section"
              {...register("sectionName", { required: true })}
              className={styles.input}
            />
             <div className={styles['btns-container']}>
               <IconBtn
                type="submit"
                disabled={loading}
                text={editSectionName ? "Edit Section Name" : "Create Section"}
                outline={true}
              >
                <IoAddCircleOutline size={20} className="" />
              </IconBtn>
             </div>
              {/* if editSectionName mode is on */}
              {editSectionName && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className={`${styles['edit-btn']} button`}
                >
                  Cancel Edit
                </button>
              )}
          </div>
          
        </div>
      </form>

      {/* nesetd view of section - subSection */}
      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Next Prev Button */}
      <div className={styles['btns-container']}>
        <button
          onClick={goBack}
          className={`button adittional-btn`}
        >
          Back
        </button>

        {/* Next button */}
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"


import styles from '../../profile.module.css'

export default function CourseInformationForm() {

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        // console.log("categories", categories)
        setCourseCategories(categories)
      }
      setLoading(false)
    }
    // if form is in edit mode 
    // It will add value in input field
    if (editCourse) {
      // console.log("editCourse ", editCourse)
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }

    getCategories()
  }, [])



  const isFormUpdated = () => {
    const currentValues = getValues()


    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail) {
      return true
    }
    return false
  }
  

  //   handle next button click
  const onSubmit = async (data) => {
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log('data -> ',data)
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
          // formData.append("tag", data.courseTags)
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
       
        if (currentValues.courseRequirements.toString() !== course.instructions.toString()) {
          formData.append("instructions", JSON.stringify(data.courseRequirements))
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }

        // send data to backend
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form! Just close the window")
      }
      return
    }

    // user has visted first time to step 1 
    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['course-info']}>
      <div className={styles.row}>
        <Upload
          name="courseImage"
          label="Course Thumbnail"
          register={register}
          setValue={setValue}
          errors={errors}
          editData={editCourse ? course?.thumbnail : null}
        />
      </div>

      <div className={styles.row}>
        <div className={`${styles.col} ${errors.courseTitle ? 'col-error' : ''}`}>
          <label htmlFor="courseTitle">
            Course Title <sup>*</sup>
          </label>
          {errors.courseTitle && (
            <span className="required">Course title is required!</span>
          )}
          <input
            id="courseTitle"
            placeholder="Enter Course Title"
            {...register("courseTitle", { required: true })}
            className={styles.input}
          />
          
        </div>

        <div className={`${styles.col} ${errors.coursePrice ? 'col-error' : ''}`}>
          <label htmlFor="coursePrice">
            Course Price <sup>*</sup>
          </label>
           {errors.coursePrice && (
            <span className="required">Course Price is required!</span>
          )}
          <input
              id="coursePrice"
              placeholder="Enter Course Price"
              {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                },
              })}
              className={styles.input}
            />
         
        </div>
      </div>

      <div className={styles.row}>
        <div className={`${styles.col} ${errors.courseShortDesc ? 'col-error' : ''}`}>
          <label htmlFor="courseShortDesc">
            Course Short Description <sup>*</sup>
          </label>
          {errors.courseShortDesc && (
            <span className="required">Course Description is required!</span>
          )}
          <textarea
            id="courseShortDesc"
            placeholder="Enter Description"
            {...register("courseShortDesc", { required: true })}
            className={styles.textarea}
          />
         
        </div>

        <div className={`${styles.col} ${errors.courseBenefits ? 'col-error' : ''}`}>
          <label htmlFor="courseBenefits">
            Benefits of the course <sup>*</sup>
          </label>
          {errors.courseBenefits && (
            <span className="required">Benefits of the course is required!</span>
          )}
          <textarea
            id="courseBenefits"
            placeholder="Enter benefits of the course"
            {...register("courseBenefits", { required: true })}
            className={styles.textarea}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={`${styles.col} ${errors.courseTags ? 'col-error' : ''}`}>
          <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and press Enter"
            register={register}
            errors={errors}
            setValue={setValue}
          />
        </div>
            <div className={`${styles.col} ${errors.courseRequirements ? 'col-error' : ''}`}>
          <RequirementsField
            name="courseRequirements"
            label="Requirements/Instructions"
            register={register}
            setValue={setValue}
            errors={errors}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={`${styles.col} ${errors.courseCategory ? 'col-error' : ''}`}>
          <label htmlFor="courseCategory">
            Select Course Category <sup>*</sup>
          </label>
          {errors.courseCategory && (
            <span className="required">Course Category is required!</span>
          )}
          <select
            {...register("courseCategory", { required: true })}
            defaultValue=""
            id="courseCategory"
            className={styles.input}
          >
            <option value="" disabled>
              Choose a Category
            </option>
            {!loading &&
              courseCategories?.map((category, indx) => (
                <option key={indx} value={category?._id}>
                  {category?.name}
                </option>
              ))}
          </select>
        </div>
    
      </div>
      <div className={styles['btns-container']}>
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={"button adittional-btn"}
          >
            Continue Without Saving
          </button>
        )}
        <IconBtn disabled={loading} text={!editCourse ? "Next" : "Save Changes"}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}



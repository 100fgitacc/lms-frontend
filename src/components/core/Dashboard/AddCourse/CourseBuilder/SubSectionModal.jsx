import { useEffect, useState } from "react"
import { useForm, Controller  } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"

import Checkbox from "react-custom-checkbox"
import { FiCheck } from "react-icons/fi"

export default function SubSectionModal({ modalData, setModalData, add = false, view = false, edit = false, }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      allowSkip: false,
      enableSeek: false,
    },
  });
    useEffect(() => {
    register("allowSkip");
    register("enableSeek");
  }, [register]);

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (view || edit) {
      console.log("modalData", modalData.allowSkip)
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
      setValue("allowSkip", modalData.allowSkip) 
      setValue("enableSeek", modalData.enableSeek);
    }
  }, [])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl ||
      currentValues.allowSkip !== modalData.allowSkip ||
      currentValues.enableSeek !== modalData.enableSeek
    ) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues();
    console.log("changes after editing form values:", currentValues)
    const formData = new FormData()
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo)
    }
    formData.append("allowSkip", currentValues.allowSkip)

    formData.append("enableSeek", currentValues.enableSeek)

    setLoading(true)
    const result = await updateSubSection(formData, token)
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
      console.log("Updated courseContent:", updatedCourseContent)
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    // console.log(data)
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("video", data.lectureVideo)
    formData.append("allowSkip", data.allowSkip)
    formData.append("enableSeek", data.enableSeek);
    setLoading(true)
    const result = await createSubSection(formData, token)
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  return (
  <div className="modal-overlay">
    <div className="modal-content">
      {/* Modal Header */}
      <div className="modal-header">
        <p className="modal-title">
          {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
        </p>
        <button
          onClick={() => (!loading ? setModalData(null) : {})}
          className="modal-close-btn"
        >
          <RxCross2 />
        </button>
      </div>

      {/* Modal Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
        <Upload
          name="lectureVideo"
          label="Lecture Video"
          register={register}
          setValue={setValue}
          errors={errors}
          video={true}
          viewData={view ? modalData.videoUrl : null}
          editData={edit ? modalData.videoUrl : null}
        />
       <Controller
          control={control}
          name="allowSkip"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              icon={<FiCheck color="#1858f3" size={14} />}
              checked={value}
              onChange={onChange}
              label="User can skip this lesson"
              labelStyle={{ marginLeft: 8, cursor: 'pointer' }}
              containerStyle={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              borderColor="#1858f3"
              size={18}
            />
          )}
        />
        <Controller
        control={control}
        name="enableSeek"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            icon={<FiCheck color="#1858f3" size={14} />}
            checked={value}
            onChange={onChange}
            label="Allow video seeking"
            labelStyle={{ marginLeft: 8, cursor: 'pointer' }}
            containerStyle={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            borderColor="#1858f3"
            size={18}
          />
        )}
        />

        {/* Title */}
        <div className="form-group">
          <label htmlFor="lectureTitle">
            Lecture Title {!view && <sup>*</sup>}
          </label>
          <input
            disabled={view || loading}
            id="lectureTitle"
            placeholder="Enter Lecture Title"
            {...register("lectureTitle", { required: true })}
            className="input"
          />
          {errors.lectureTitle && (
            <span className="required">Lecture title is required!</span>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="lectureDesc">
            Lecture Description {!view && <sup>*</sup>}
          </label>
          <textarea
            disabled={view || loading}
            id="lectureDesc"
            placeholder="Enter Lecture Description"
            {...register("lectureDesc", { required: true })}
            className="textarea"
          />
          {errors.lectureDesc && (
            <span className="required">Lecture Description is required</span>
          )}
        </div>

        {!view && (
          <div className="form-actions">
            <IconBtn
              disabled={loading}
              text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
            />
          </div>
        )}
      </form>
    </div>
  </div>
);
}
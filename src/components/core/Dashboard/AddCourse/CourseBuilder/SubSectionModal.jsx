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
  import UploadDocs from "../UploadDocs"

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
        requiresHomeworkCheck: false,
        minScore: "",
        maxScore: ""
      },
    });
      useEffect(() => {
      register("allowSkip");
      register("enableSeek");
      register("homework");
      register("requiresHomeworkCheck");
    }, [register]);

      

    // console.log("view", view)
    // console.log("edit", edit)
    // console.log("add", add)

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const { course } = useSelector((state) => state.course)
    const homeworkChecked = watch("homework");
    useEffect(() => {
      if (!homeworkChecked) {
        setValue("homeworkText", "")
        setValue("homeworkLink", "")
        setValue("homeworkFile", null)
      }
    }, [homeworkChecked])
    const [previewFileUrl, setPreviewFileUrl] = useState("")

    useEffect(() => {
      if (view || edit) {
        console.log("modalData", modalData.allowSkip)
        setValue("lectureTitle", modalData.title)
        setValue("lectureDesc", modalData.description)
        setValue("lectureVideo", modalData.videoUrl)
        setValue("allowSkip", modalData.allowSkip) 
        setValue("enableSeek", modalData.enableSeek);
        if (modalData.homeworks && Array.isArray(modalData.homeworks)) {
        setValue("homework", modalData.homeworks.length > 0)
        modalData.homeworks.forEach(hw => {
        if (hw.type === "text") setValue("homeworkText", hw.value)
        if (hw.type === "link") setValue("homeworkLink", hw.value)
        if (hw.type === "file") {
          const fileUrl = modalData.fileBaseUrl ? `${modalData.fileBaseUrl}/${hw.value}` : hw.value
          setValue("homeworkFile", hw.value)  
          setPreviewFileUrl(fileUrl)          
        }
        if (modalData.requiresHomeworkCheck) {
          setValue("requiresHomeworkCheck", true)
          setValue("minScore", modalData.minScore || "")
          setValue("maxScore", modalData.maxScore || "")
        }
      })
      }
      }
    }, [modalData])

    // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl ||
      currentValues.allowSkip !== modalData.allowSkip ||
      currentValues.enableSeek !== modalData.enableSeek
    ) {
      return true;
    }

    const modalHasHomework = modalData.homeworks && modalData.homeworks.length > 0;
    if (currentValues.homework !== modalHasHomework) {
      return true;
    }

    if (currentValues.homework) {
      const hwText = modalData.homeworks?.find(hw => hw.type === "text")?.value || "";
      const hwLink = modalData.homeworks?.find(hw => hw.type === "link")?.value || "";
      const hwFile = modalData.homeworks?.find(hw => hw.type === "file")?.value || "";

      if ((currentValues.homeworkText || "") !== hwText) return true;
      if ((currentValues.homeworkLink || "") !== hwLink) return true;
      if (currentValues.homeworkFile) {
        if (currentValues.homeworkFile.name !== hwFile) return true;
      } else if (hwFile) {
        return true;
      }
    }

    return false;
  };


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

      const homeworks = []
      if (currentValues.homework) {
        if (currentValues.homeworkText?.trim()) {
          homeworks.push({ type: "text", value: currentValues.homeworkText.trim() })
        }
        if (currentValues.homeworkLink?.trim()) {
          homeworks.push({ type: "link", value: currentValues.homeworkLink.trim() })
        }
        if (currentValues.homeworkFile) {
          formData.append("homeworkFile", currentValues.homeworkFile) 
          homeworks.push({ type: "file", value: currentValues.homeworkFile.name })
        }
      }
      formData.append("homeworks", JSON.stringify(homeworks))
      formData.append("requiresHomeworkCheck", currentValues.requiresHomeworkCheck)
      if (currentValues.requiresHomeworkCheck) {
        formData.append("minScore", currentValues.minScore)
        formData.append("maxScore", currentValues.maxScore)
      }
      

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
          toast.error("No changes made to the form! Just close the window")
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
      const homeworks = []
      if (data.homework) {
        if (data.homeworkText?.trim()) {
          homeworks.push({ type: "text", value: data.homeworkText.trim() })
        }
        if (data.homeworkLink?.trim()) {
          homeworks.push({ type: "link", value: data.homeworkLink.trim() })
        }
        if (data.homeworkFile) {
          formData.append("homeworkFile", data.homeworkFile)
          homeworks.push({ type: "file", value: data.homeworkFile.name })
        }
      }
      formData.append("homeworks", JSON.stringify(homeworks))

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
          <div className="form-group">
            <Controller
              control={control}
              name="homework"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  icon={<FiCheck color="#1858f3" size={14} />}
                  checked={value}
                  onChange={onChange}
                  label={value ? "Remove Homework from lecture" : "Add Homework to lecture"}
                  labelStyle={{ marginLeft: 8, cursor: 'pointer' }}
                  containerStyle={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  borderColor="#1858f3"
                  size={18}
                />
              )}
            />
            

            {homeworkChecked && (
              <>
                {/* === Homework Check Settings === */}
                <div className="form-group">
                  <Controller
                    control={control}
                    name="requiresHomeworkCheck"
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        icon={<FiCheck color="#1858f3" size={14} />}
                        checked={value}
                        onChange={onChange}
                        label="This homework should be with evaluation"
                        labelStyle={{ marginLeft: 8, cursor: 'pointer' }}
                        containerStyle={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        borderColor="#1858f3"
                        size={18}
                      />
                    )}
                  />

                  {/* Inputs for min/max score */}
                  {watch("requiresHomeworkCheck") && (
                    <div className="flex flex-col gap-2 mt-3">
                      <div className="form-group">
                        <label>Min Score</label>
                        <input
                          type="number"
                          min={0}
                          {...register("minScore", {
                            required: true,
                            validate: (val) => !isNaN(val) || "Min score must be a number"
                          })}
                          className="input"
                        />
                        {errors.minScore && (
                          <span className="required">{errors.minScore.message}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Max Score</label>
                        <input
                          type="number"
                          min={1}
                          {...register("maxScore", {
                            required: true,
                            validate: (val) => !isNaN(val) || "Max score must be a number"
                          })}
                          className="input"
                        />
                        {errors.maxScore && (
                          <span className="required">{errors.maxScore.message}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                  <div className="form-group">
                <label>Homework Text {!view && <sup>*</sup>}</label>
                <textarea
                  disabled={view || loading}
                  placeholder="Enter homework details..."
                  {...register("homeworkText", {
                    validate: value => {
                      if (watch("homework")) {
                        return value?.trim() !== "" || "Homework text is required"
                      }
                      return true
                    }
                  })}
                  className="textarea"
                />
                {errors.homeworkText && (
                  <span className="required">{errors.homeworkText.message}</span>
                )}

                <label style={{ marginTop: "1rem" }}>Homework Link</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  {...register("homeworkLink")}
                  className="input"
                />
                <UploadDocs
                  type="text" 
                  name="homeworkFile"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  editData={previewFileUrl}
                />
              </div>
              </>
            
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
import { useState } from "react"
import {useSelector } from "react-redux"
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom"
import styles from '../../../pages/coursePage.module.css'
import UploadDocs from "../Dashboard/AddCourse/UploadDocs"
import { homeworkSend, getHomeworkBySubSection } from "../../../services/operations/studentFeaturesAPI"
import toast from "react-hot-toast";
export default function HomeworkContent({ videoData, homework,setHomework  }) {

    const { courseId, subSectionId } = useParams()
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile);
    const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch
    } = useForm();  
    
    const homeworkFile = watch("homeworkFile");
    const [previewFileUrl, setPreviewFileUrl] = useState("")
    
    const handleSendHomework = async (data) => {
      const formData = new FormData()
      formData.append("courseId", courseId)
      formData.append("subSectionId", subSectionId)
      formData.append("answerText", data.answerText || "")
      
      if (data.homeworkFile) {
        formData.append("file", data.homeworkFile)
      }
      
      const success = await homeworkSend(formData, token)
    
      if (success) {
        toast.success("Homework submitted successfully")
        reset() 
        
        
        
        if (!user?._id) return;
        const updatedHomework = await getHomeworkBySubSection(subSectionId, token, user._id)
        setHomework(updatedHomework)
      } else {
        toast.error("Failed to submit homework")
      }
    }
    const downloadFile = async (url, filename) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();

        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
    }
    };
 
    return (() =>{
          const minScore = videoData?.minScore || 0;
          const score = homework?.score || 0;

          const needsResubmission = homework?.status === 'resubmission' && score < minScore;
          
          return(
          <>
          {videoData?.homeworks && (
            homework?.status === undefined ||
            homework?.status === 'not_started' ||
            homework?.status === 'resubmission'
          ) ? (
            <div className={`${styles['homework-wrapper']} ${styles.wrapper}`}>
                {homework?.feedback && (
                  <div className={styles['homework-feedback']}>
                    <p className={`${styles['feedback-title']}`}>You have feedback from your teacher!</p>
                    <p className={styles.feedback}>{homework.feedback}</p>
                  </div>
                )}
                {needsResubmission && (
                  <div className={styles['homework-feedback']}>
                    <p className={`${styles['feedback-title']}`}>Resubmission needed!</p>
                    <p className={styles.feedback}>Your score for this lesson is: {score}. Min score for complete lesson is: {videoData.minScore ?? "-"}</p>
                  </div>
                )}
                <h5 className={`${styles['homework-title']} `}>Homework:</h5>
                <div className={`${styles['homework-materials']}`}>
                  {videoData.homeworks.length > 0 &&
                    videoData.homeworks.map((item, index) => (
                    <div key={item._id || index} style={{ marginBottom: '1rem' }}>
                      {item.type === 'text' && (
                        <>
                          <h6>Your task:</h6>
                          <p>{item.value}</p>
                        </>
                      )}

                      {item.type === 'link' && (
                        <>
                          <h6>Useful link:</h6>
                          <a href={item.value} target="_blank" rel="noopener noreferrer">
                            {item.value}
                          </a>
                        </>
                      )}

                        {item.type === 'file' && (
                          <>
                            <h6>Lesson materials:</h6>
                            <button
                              type="button"
                              onClick={() => downloadFile(item.value.url, item.value.filename)}
                              className={styles.downloadBtn}
                            >
                              {item.value.filename}
                            </button>
                          </>
                        )}
                    </div>
                  ))}
                </div>
              
                <h5 className={`${styles['homework-title']}`}>Your Answer:</h5>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(handleSendHomework)(e);
                }} className={styles["homework-zone"]}>
                  {errors.answerText && (
                    <span className="required">
                      {errors.answerText.message}  <sup>*</sup>
                    </span>
                  )}
                  <textarea
                    placeholder="Typing your answer"
                    className="textarea"
                    {...register("answerText", { required: "Answer is required" })}
                  />
                    <UploadDocs
                      type="text"
                      name="homeworkFile"
                      register={register}
                      setValue={setValue}
                      errors={errors}
                      homeworkFile={homeworkFile}
                      editData={previewFileUrl}
                    />
                    <button type="submit" className={`button`}>
                    Send homework
                  </button>

                  
                </form>
              </div>
          )  : homework?.status === 'reviewed' ? (
            <div className={`${styles['homework-wrapper']} ${styles.wrapper}`}>
              {homework?.score && homework?.score > 0 ? (
                <div className={styles['done-container']}>
                  <p className={styles['done-text']}>🎉 Lesson is done! Your score: {homework?.score} points 🎉</p>
                  {homework?.feedback && (
                    <div className={styles['homework-feedback']}>
                      <p className={`${styles['feedback-title']}`}>Latest feedback from your teacher:</p>
                      <p className={styles.feedback}>{homework.feedback}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles['done-container']}>
                
                  <p className={styles['done-text']}>🎉 Lesson is done! 🎉</p>
                  {homework?.feedback && (
                    <div className={styles['homework-feedback']}>
                      <p className={`${styles['feedback-title']}`}>Latest feedback from your teacher:</p>
                      <p className={styles.feedback}>{homework.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : homework?.status === 'not_reviewed' ? (
            <div className={`${styles['homework-wrapper']} ${styles.wrapper}`}>
              <p>Your homework is under review</p>
            </div>
          ) : (
            <div className={`${styles['homework-wrapper']} ${styles.wrapper}`}>
              <p>This lesson does not include homework!</p>
            </div>
            )}
          </>
          );
        })()
}

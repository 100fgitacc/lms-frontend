import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../common/Loader";
import styles from "./assignments.module.css";
import { getAllStudentsByInstructorData } from "../../../../services/operations/adminApi";
import { updateHomeworkStatus  } from "../../../../services/operations/homeworkApi";
import toast from "react-hot-toast";


export default function StudentLesson() {
  const { courseId, studentId, lessonId } = useParams();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [studentHomework, setStudentHomework] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [score, setScore] = useState(null);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [acceptHomework, setAcceptHomework] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { allStudentsDetails } = await getAllStudentsByInstructorData(token);

      const student = allStudentsDetails.find((s) => s._id === studentId);
      const course = student?.courses.find((c) => c._id === courseId);
      const studentHw = course?.homeworksBySubSection?.[lessonId]?.find(
        (hw) => hw.user === studentId
      );

      const foundLesson = course?.courseContent
        .flatMap((sec) => sec.subSection)
        .find((sub) => sub._id === lessonId);

      setLesson(foundLesson || null);
      setStudentHomework(studentHw || null);
      setReviewText(studentHw?.reviewText || "");
      setScore(studentHw?.score || lesson?.minScore || 0);
      setLoading(false);
    }
    fetchData();
  }, [courseId, studentId, lessonId]);
  
  console.log( lesson?.requiresHomeworkCheck);
  

  const handleAccept = async () => {
    try {
      const payload = {
        homeworkId: studentHomework._id, 
        status: "reviewed",
        score,
        feedback: reviewText,
        reviewed: true,
      };
      const result = await updateHomeworkStatus(token, payload);

      if (result?.success) {
        toast.success("Homework accepted!");
        setAcceptHomework(false);
        setStudentHomework((prev) => ({
          ...prev,
          status: "reviewed",
          score,
          feedback: reviewText,
          reviewed: true,
        }));
      } else {
        toast.error("Failed to accept homework: " + (result?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Failed to update homework status");
      console.error(error);
    }
  };

  const handleRequestChanges = async () => {
    if (!reviewText.trim()) {
      toast.error("Please enter feedback or notes before requesting changes.");
      return;
    }
    try {
      const payload = {
        homeworkId: studentHomework._id,
        status: "resubmission",
        feedback: reviewText,
        reviewed: false,
      };
      const result = await updateHomeworkStatus(token, payload);

      if (result?.success) {
        toast.success("Requested changes for homework successfully.");
        setReviewText("");
        setStudentHomework((prev) => ({
          ...prev,
          status: "resubmission",
          feedback: reviewText,
          reviewed: false,
        }));
      } else {
        toast.error("Failed to request changes: " + (result?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Failed to request changes. Please try again later.");
      console.error("Error in handleRequestChanges:", error);
    }
  };


  if (loading) return <Loader type="fullscreen" />;
  if (!lesson) return <p>Lesson not found</p>;


  return (
    <div className={styles.wrapper}>
      <div className={styles['lesson-heading']}>
        <h2 className={`secondary-title`}>Student Homework Review</h2>
        <button  onClick={() => navigate(-1)}>← Back to Course Assignments</button>
      </div>
      <div className={`${styles['lesson-container']}`}>
         <div className={`${styles['lesson-homework']} ${styles.wrapper}`}>
            {lesson.homeworks.length > 0 ? (
              <>
                <h4 className={styles['lesson-data-heading']}>Homework of this lesson:</h4>
                <div className={styles.homeworkContainer}>
                  {lesson.homeworks.map(hw => {
                    if (hw.type === "text") {
                      return (
                        <div key={hw._id} className={styles.hwBlock}>
                          <p className={styles['section-heading']}>Homework text:</p>
                          <p>{hw.value}</p>
                        </div>
                      )
                    } else if (hw.type === "link") {
                      return (
                        <div key={hw._id} className={styles.hwBlock}>
                          <p className={styles['section-heading']}>Homework useful link:</p>
                          <a href={hw.value} target="_blank" rel="noreferrer" >
                            {hw.value}
                          </a>
                        </div>
                      )
                    } else if (hw.type === "file") {
                      return (
                        <div key={hw._id} className={styles.hwBlock}>
                          <p className={styles['section-heading']}>Homework file:</p>
                          <a href={hw.value.url} target="_blank" rel="noreferrer">
                            {hw.value.filename}
                          </a>
                        </div>
                      )
                    } else {
                      return null;
                    }
                  })}
                </div>
              </>
            ):(
              <p>This lesson is not contain homework</p>
            )}
           

          </div>
        <div className={`${styles['lesson-data']} ${styles.wrapper}`}>
          
          {studentHomework && studentHomework.reviewed && <p className={styles.reviewed}>Already Reviewed</p>}
          <h4 className={styles['lesson-data-heading']}>Lesson data:</h4>
          <p className={styles['section-heading']}>Lesson name:</p>
          <p>{lesson.title}</p>
          <p className={styles['section-heading']}>Lesson description:</p>
          <p>{lesson.description}</p>
          <p className={styles['section-heading']}>Status:</p>
          <p>{studentHomework?.status}</p>
          <p className={styles['section-heading']}>User can skip lesson:</p>
          <p>{lesson.allowSkip ? "Yes" : "No"}</p>
          <p className={styles['section-heading']}>User can seek video:</p>
          <p>{lesson.enableSeek ? "Yes" : "No"}</p>
          <p className={styles['section-heading']}>Is homework required:</p>
          <p>{lesson.requiresHomeworkCheck ? "Yes" : "No"}</p>
        </div>
       
      </div>

      {lesson.homeworks.length === 0 ? null : (
        studentHomework ? (
          <div className={`${styles['student-answer']} ${styles.wrapper}`}>
            <h4 className={styles['lesson-data-heading']}>Student Answer:</h4>
            <p className={styles['section-heading']}>Student Answer text:</p>
            <p>{studentHomework.answerText}</p>

            <p className={styles['section-heading']}>Pinned Materials by Student:</p>
            {studentHomework?.file ? (
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = studentHomework.file.url;
                  link.setAttribute("download", decodeURIComponent(studentHomework.file.filename));
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className={styles.fileLink}
              >
                Download: {decodeURIComponent(studentHomework.file.filename)}
              </button>
            ) : (
              <p>No file attached by student.</p>
            )}

            {studentHomework.status === "not_reviewed" && (
              <div className={styles['homework-check-container']}>
                <h4 className={styles['lesson-data-heading']}>Homework Check:</h4>
                <textarea
                  className={`textarea ${styles['check-homework-field']}`}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Enter feedback or notes..."
                />

                {(lesson.requiresHomeworkCheck && acceptHomework) && (
                  <>
                    <p className={styles['section-heading']}>
                      Set your score for user between {lesson.minScore} and {lesson.maxScore} point:
                    </p>
                    <div className={styles['score-wrapper']}>
                      <label className={styles['score-label']}>
                        <span className={styles['score-text']}>Score: {score}</span>
                        <input
                          type="range"
                          min={lesson.minScore}
                          max={lesson.maxScore}
                          step="1"
                          value={score}
                          onChange={(e) => setScore(Number(e.target.value))}
                          className={styles.slider}
                        />
                        <div className={styles.sliderTicks}>
                          {Array.from({ length: lesson.maxScore - lesson.minScore + 1 }).map((_, idx) => (
                            <span key={idx} className={styles.tick}></span>
                          ))}
                        </div>
                      </label>
                    </div>
                  </>
                )}

                <div className={styles.buttons}>
                  {acceptHomework ? (
                    <>
                      <button className={`button ${styles['confirm-btn']}`} onClick={handleAccept}>
                        Confirm
                      </button>
                      <button className={`button ${styles['cancel-btn']}`} onClick={() => setAcceptHomework(false)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className={`button ${styles['accept-btn']}`} 
                      onClick={() =>
                        lesson?.requiresHomeworkCheck
                          ? setAcceptHomework(true)
                          : handleAccept()
                      }>
                        Accept homework
                      </button>
                      <button className={`button ${styles['request-btn']}`} onClick={handleRequestChanges}>
                        Request Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className={styles.noHw}>Student has not submitted homework yet.</p>
        )
      )}

    </div>
  );
}

import { useEffect } from "react";
import { useSelector } from "react-redux";
import RenderSteps from "./RenderSteps"

import styles from '../profile.module.css'



export default function AddCourse() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  const { step } = useSelector((state) => state.course)

  return (
    <div className={styles['add-course']}>

      <div className={styles.wrapper}>
        <div className={styles['settings-heading']}>
          <h3>
            {
              step === 1 ? 'Add New Course Info' 
              : step === 2 ? 'Lets Build Your Own Course'
              : 'Publish Settings'
            }
            
          </h3>
        </div>

        <div className="">
          <RenderSteps />
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles['settings-heading']}>
          <h3>⚡ Course Upload Tips</h3>
        </div>
        <ul className={styles['upload-tips']}>
          <li className={styles['upload-tips-item']}>Set the Course Price option or make it free.</li>
          <li className={styles['upload-tips-item']}>Standard size for the course thumbnail is 1024x576.</li>
          <li className={styles['upload-tips-item']}>Video section controls the course overview video.</li>
          <li className={styles['upload-tips-item']}>Course Builder is where you create & organize a course.</li>
          <li className={styles['upload-tips-item']}>Add Topics in the Course Builder section to create lessons,quizzes, and assignments.</li>
          <li className={styles['upload-tips-item']}>Information from the Additional Data section shows up on thecourse single page.</li>
          <li className={styles['upload-tips-item']}>Make Announcements to notify any important</li>
          <li className={styles['upload-tips-item']}>Notes to all enrolled students at once.</li>
        </ul>
      </div>
    </div>
  )
}
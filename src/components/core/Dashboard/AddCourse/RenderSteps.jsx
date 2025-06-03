import React from "react"
import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"
import EditCourse from './../EditCourse/EditCourse';

import styles from '../profile.module.css'

export default function RenderSteps() {

  const { step } = useSelector((state) => state.course)
  const { editCourse } = useSelector(state => state.course)


  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ]

  return (
    <>
      <div className={styles.steps}>
        {steps.map((item) => (
         <>
          <div key={item.id}>
            <div className={styles['step-title']}>
              <div className={`${step === item.id ? styles['step-number-active'] : styles['step-number']} ${step > item.id && ""}} `}>
                {step > item.id ? (<FaCheck className="" />): (item.id)}
              </div>
               <div className={styles['step-text']}>
                 {item.title}
              </div>
            </div>
            
          </div>
          {item.id !== steps.length && (
             <div className={` ${step > item.id ? styles['step-line'] : styles['step-line-active']} `}></div>
            )}
         </>
        ))}
      </div>

      {/* <div className={styles['steps-title']}>
        {steps.map((item) => (
          <div className={` ${editCourse && ''}`} key={item.id}>
            <p className={` ${step >= item.id ? "" : ""}`}>
             
            </p>
          </div>
        ))}
      </div> */}

      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  )
}
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { RiDeleteBin6Line } from 'react-icons/ri'

import styles from '../../profile.module.css'


export default function RequirementsField({ name, label, register, setValue, errors, }) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement, setRequirement] = useState("")
  const [requirementsList, setRequirementsList] = useState([])

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions)
    }
    register(name, { required: true, validate: (value) => value.length > 0 }, requirementsList)
  }, [])

  useEffect(() => {
    setValue(name, requirementsList)
  }, [requirementsList])

  // add instruction
  const handleAddRequirement = () => {
    if (requirement && !requirementsList.includes(requirement)) {
      setRequirementsList([...requirementsList, requirement])
      setRequirement("")
    }
  }

  // delete instruction
  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList]
    updatedRequirements.splice(index, 1)
    setRequirementsList(updatedRequirements)
  }

  return (
    <>
      <label className="" htmlFor={name}>
        {label} <sup>*</sup>
      </label>
      {errors[name] && (
        <span className="required">
          {label} is required!
        </span>
      )}
      <input
        placeholder="Enter instruction and press Enter"
        type="text"
        id={name}
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (requirement.trim() && !requirementsList.includes(requirement.trim())) {
              setRequirementsList([...requirementsList, requirement.trim()]);
              setRequirement("");
            }
          }
        }}
        className={styles.input}
      />
      {requirementsList.length > 0 && (
        <ul className={styles['requirement-list']}>
          {requirementsList.map((requirement, index) => (
            <li key={index} className={styles['requirement-list-item']}>
              <span>{requirement}</span>
              <button
                type="button"
                className={styles['remove-requirements']}
                onClick={() => handleRemoveRequirement(index)}
              >
                {/* clear  */}
                <RiDeleteBin6Line className={styles['remove-requirement']} />
                
              </button>
            </li>
          ))}
        </ul>
      )}

      
    </>
  )
}
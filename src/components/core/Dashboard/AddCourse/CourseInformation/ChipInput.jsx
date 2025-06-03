import { useEffect, useState } from "react"

import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

import styles from '../../profile.module.css'

// Defining a functional component ChipInput
export default function ChipInput({ label, name, placeholder, register, errors, setValue, }) {
  const { editCourse, course } = useSelector((state) => state.course)

  // Setting up state for managing chips array
  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse) {
      // setChips(JSON.parse(course?.tag))

      setChips(course?.tag)
    }

    register(name, { required: true, validate: (value) => value.length > 0 }, chips);
  }, [])

  // "Updates value whenever 'chips' is modified
  useEffect(() => {
    setValue(name, chips)
  }, [chips])

  // Function to handle user input when chips are added
  const handleKeyDown = (event) => {
    // Check if user presses "Enter" or ","
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      // Get the input value and remove any leading/trailing spaces
      const chipValue = event.target.value.trim()
      // Check if the input value exists and is not already in the chips array
      if (chipValue && !chips.includes(chipValue)) {
        // Add the chip to the array and clear the input
        const newChips = [...chips, chipValue]

        setChips(newChips)
        event.target.value = ""
      }
    }
  }

  // Function to handle deletion of a chip
  const handleDeleteChip = (chipIndex) => {
    // Filter the chips array to remove the chip with the given index
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  // Render the component
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
      <div className={styles['tag-container']}>
        {chips?.map((chip, index) => (
          <div key={index} className={styles['tag']}>
            {chip}
            <button
              type="button"
              className={styles['del-tag']}
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="" />
            </button>
          </div>
        ))}
      </div>
       <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
      
    </>
  )
}
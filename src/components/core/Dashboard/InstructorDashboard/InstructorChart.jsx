import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

import styles from '../profile.module.css'

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")

  // Function to generate random colors for the chart
  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    
    plugins: {
      legend: {
        display: false,
        position: 'top',
        labels: {
          font: {
            size: 10, 
          },
        }
      },
    }
  }

  return (
    <div className={`${styles.wrapper}`}>
      <div className={styles.heading}>
        <h3>Now you can see : { currChart === "students" ? "students chart" : "income chart"}</h3>
        <div className={styles['chart-switchers']}>
          <button
            onClick={() => setCurrChart("students")}
            className={currChart === "students"
              ? styles['button-active']
              : styles.button
              }
          >
            Students
          </button>
          <button
            onClick={() => setCurrChart("income")}
            className={` ${currChart === "income"
              ? styles['button-active']
              : styles.button
              }`}
          >
            Income
          </button>
        </div>
      </div>
      <div>
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}

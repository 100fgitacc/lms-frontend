import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

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
    <div className="flex flex-1 flex-col gap-y-4 rounded-md  p-6  border-2 border-gray">
      <p className="font-wadik text-lg font-bold text-white">Now you see { currChart === "students" ? "students chart" : "income chart"}</p>

      <div className="space-x-4 font-semibold ">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${currChart === "students"
            ? "text-yellow-100 bg-blue-500 border border-gray"
            : "text-gray bg-gray border border-gray"
            }`}
        >
          Students
        </button>

        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`bg-blue-700 rounded-sm p-1 px-3 transition-all duration-200 ${currChart === "income"
            ? "text-yellow-100 bg-blue-500 border border-gray"
            : "text-gray bg-gray border border-gray"
            }`}
        >
          Income
        </button>
      </div>

      <div className="relative mx-auto aspect-square  h-[250px] w-[250px]">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  )
}

import { useEffect } from "react";
import RenderSteps from "./RenderSteps"



export default function AddCourse() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div className="flex w-full items-start gap-x-6">

      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-white font-wadik text-center lg:text-left">
          Add Course
        </h1>

        <div className="flex-1">
          <RenderSteps />
        </div>
      </div>

      {/* Course Upload Tips */}
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md bg-white  p-6 ">
        <p className="mb-8 text-lg text-black">⚡ Course Upload Tips</p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-black">
          <li>Set the Course Price option or make it free.</li>
          <li>Standard size for the course thumbnail is 1024x576.</li>
          <li>Video section controls the course overview video.</li>
          <li>Course Builder is where you create & organize a course.</li>
          <li>Add Topics in the Course Builder section to create lessons,quizzes, and assignments.</li>
          <li>Information from the Additional Data section shows up on thecourse single page.</li>
          <li>Make Announcements to notify any important</li>
          <li>Notes to all enrolled students at once.</li>
        </ul>
      </div>
    </div>
  )
}
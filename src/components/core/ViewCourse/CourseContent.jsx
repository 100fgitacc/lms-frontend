import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { useLocation, useNavigate, useParams } from "react-router-dom"

import { getHomeworkBySubSection } from "../../../services/operations/studentFeaturesAPI"

import CourseOverview from "./CourseOverview"
import LessonContent from "./LessonContent";
import HomeworkContent from "./HomeworkContent";

const CourseContent = ({ content  }) => {
 
  const navigate = useNavigate()
  const location = useLocation()

  const { courseId, sectionId, subSectionId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile);
  const { courseSectionData } = useSelector((state) => state.viewCourse)
  const { courseViewSidebar } = useSelector((state) => state.sidebar)
  const [videoData, setVideoData] = useState(null)
  const [homework, setHomework] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseSectionData.length) return;
      if (!courseId || !sectionId || !subSectionId) {
        navigate("/dashboard/enrolled-courses");
        return;
      }

      const section = courseSectionData.find((sec) => sec._id === sectionId);
      const subsection = section?.subSection.find((sub) => sub._id === subSectionId);

      setVideoData(subsection || null);

      if (!user?._id) return;
      const homeworkData = await getHomeworkBySubSection(subSectionId, token, user._id);
      setHomework(homeworkData);
    };

    fetchData();
  }, [courseSectionData, location.pathname, courseId, sectionId, subSectionId, token, user]);


  

 

  if (courseViewSidebar && window.innerWidth <= 640) return null

    
  return (
    <>
      {content === 'Lesson' && <LessonContent content={content} videoData={videoData} homework={homework}  />}
      {content === 'Homework' && <HomeworkContent content={content}  videoData={videoData} homework={homework}  setHomework={setHomework} />}
      {content === 'Overview' && <CourseOverview />}
    </>
  )
}

export default CourseContent;

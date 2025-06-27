import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllStudentsByInstructorData } from '../../../services/operations/adminApi'
import { useNavigate } from "react-router-dom"

import styles from './profile.module.css'
import Loader from '../../common/Loader'


const AllStudentsByInstructor = () => {

    const { token } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [allStudentsDetails, setAllStudentsDetails] = useState([]);

    useEffect(() => {
        const fetchAllStudents = async () => {
        setLoading(true)
        const { allStudentsDetails} = await getAllStudentsByInstructorData(token);
        setAllStudentsDetails(allStudentsDetails);
        };
        fetchAllStudents();
        setLoading(false)
    }, [token]);



  const [filters, setFilters] = useState({
    name: '',
    courseName: '',
    maxProgress: 100,
    courseStatus: '',
    dateRangeStart: '',
    dateRangeEnd: '',
    currentSubSection: '',
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredStudents = allStudentsDetails
  .map((student) => {
    const filteredCourses = student.courses.filter((course) => {
      const courseMatch = course.courseName.toLowerCase().includes(filters.courseName.toLowerCase());
      const progressMatch = course.progressPercentage <= filters.maxProgress;
      const statusMatch =
        filters.courseStatus === '' ||
        (filters.courseStatus === 'completed' && course.completedAt) ||
        (filters.courseStatus === 'in process' && !course.completedAt);
      const dateMatch =
        (!filters.dateRangeStart || new Date(course.startedAt) >= new Date(filters.dateRangeStart)) &&
        (!filters.dateRangeEnd || new Date(course.startedAt) <= new Date(filters.dateRangeEnd));
      const currentSubSectionMatch =
        !filters.currentSubSection ||
        (course.currentSubSection?.title || '').toLowerCase().includes(filters.currentSubSection.toLowerCase());

      return courseMatch && progressMatch && statusMatch && dateMatch && currentSubSectionMatch;
    });

    const nameMatch = student.firstName.toLowerCase().includes(filters.name.toLowerCase());

    if (filteredCourses.length > 0 && nameMatch) {
      return { ...student, courses: filteredCourses };
    }

    return null;
  })
  .filter(Boolean);

  
    return (
        <div className={styles['wrapper']}>
            <div className={styles['heading']}>
              <h3>All Students of current instructor</h3>
              <p>Total students : {allStudentsDetails.length}</p>
            </div>
            <div>
              {loading ? (
                  <Loader/>
              ) : !allStudentsDetails ? (
                  <p>
                      No Data Available
                  </p>
              ) : (
                <div>
                  <p className={styles['filter-title']}>Filtered by:</p>
                  <table className={styles.filter}>
                      <thead>
                        <tr >
                          <th >Student</th>
                          <th >Course</th>
                          <th >Progress (%)</th>
                          <th >Status</th>
                          <th >Start Date</th>
                          <th >End Date</th>
                          <th >Lastest lesson</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr >
                          <td >
                            <input
                              type="text"
                              name="name"
                              placeholder="Student name"
                              value={filters.name}
                              onChange={handleFilterChange}
                            />
                          </td>
                          <td >
                            <input
                              type="text"
                              name="courseName"
                              placeholder="Course name"
                              value={filters.courseName}
                              onChange={handleFilterChange}
                              
                            />
                          </td>
                          <td >
                            <input
                              type="number"
                              name="maxProgress"
                              placeholder="value %"
                              value={filters.maxProgress}
                              min={0}
                              max={100}
                              onChange={handleFilterChange}
                              
                            />
                          </td>
                          <td >
                            <select
                              name="courseStatus"
                              value={filters.courseStatus}
                              onChange={handleFilterChange}
                              
                            >
                              <option value="">Select Status</option>
                              <option value="completed">Completed</option>
                              <option value="in process">In Process</option>
                            </select>
                          </td>
                          <td >
                            <input
                              type="date"
                              name="dateRangeStart"
                              value={filters.dateRangeStart}
                              onChange={handleFilterChange}
                              
                            />
                          </td>
                          <td >
                            <input
                              type="date"
                              name="dateRangeEnd"
                              value={filters.dateRangeEnd}
                              onChange={handleFilterChange}
                              
                            />
                          </td>
                          <td >
                            <input
                              type="text"
                              name="currentSubSection"
                              placeholder="Lesson name"
                              value={filters.currentSubSection}
                              onChange={handleFilterChange}
                              
                            />
                          </td>
                        </tr>
                      </tbody>
                  </table>

                  {filteredStudents.map((student) => (
                    <div key={student._id} className={styles.wrapper}>
                      <div className={styles['students-table-item']}>
                        <div>
                          <p className={styles.bold}>Student name:</p>
                          <p>{student.firstName}</p>
                        </div>
                        <div>
                          <p className={styles.bold}>Student email:</p>
                          <p >{student.email}</p>
                        </div>
                        <strong>
                          Total enrolled courses ({student.courses.length})
                        </strong>
                      </div>

                      <table >
                        <thead >
                          <tr>
                            <th >#</th>
                            <th >Course Name</th>
                            <th >Start Date</th>
                            <th >Complete Date</th>
                            <th >Progress</th>
                            <th>Last Completed Lesson</th>
                            <th>Last Lesson Activity</th>
                            <th>Next Pending Lesson</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.courses.map((course, index) => (
                            <tr key={index} onClick={() => { navigate(`/dashboard/personal-assignments/${course._id}/${student._id}`)}}>
                              <td >{index + 1}</td>
                              <td >{course.courseName}</td>
                              
                              <td >
                                {new Date(course.startedAt).toLocaleDateString()}
                              </td>
                              <td >
                                {course.completedAt ? new Date(course.completedAt).toLocaleDateString() : 'in process...'}
                              </td>
                              <td >{course.progressPercentage}%</td>
                              <td>
                                {course.currentLesson?.lastCompleted
                                  ? course.currentLesson.lastCompleted.title
                                  : <em style={{ color: "gray" }}>No lessons completed</em>}
                              </td>
                              <td>{course?.lastActivity || '-'}</td>
                              <td>
                                {course.currentLesson?.nextPending
                                  ? `${course.currentLesson.nextPending.title} (${course.currentLesson.nextPending.reason.replace(/_/g, ' ')})`
                                  : <em style={{ color: "green" }}>Course completed</em>}
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
    );
}

export default AllStudentsByInstructor
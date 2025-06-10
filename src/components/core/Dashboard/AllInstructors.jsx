import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAllInstructorDetails } from "../../../services/operations/adminApi";

import styles from './profile.module.css'
import Loader from "../../common/Loader";






function AllInstructors() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [allInstructorDetails, setAllInstructorDetails] = useState([]);
  const [instructorsCount, setInstructorsCount] = useState();
  const [loading, setLoading] = useState(true)



  // useEffect(() => {
  //   const fetchInstructorsData = async () => {
  //     setLoading(true)
  //     const { allInstructorsDetails, instructorsCount } = await getAllInstructorDetails(token);
  //     if (allInstructorsDetails) {
  //       setAllInstructorDetails(allInstructorsDetails);
  //       setInstructorsCount(instructorsCount)
  //     }
  //     setLoading(false)
  //   };

  //   fetchInstructorsData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
  <div className={`${styles.wrapper} ${styles.details}`}>
    <div className={styles.heading}>
      <h2 className={`${styles.title} secondary-title`}>All Instructors Details</h2>
      <strong>
        Total instructors: {instructorsCount}
      </strong>
    </div>

    <div>
      {loading ? (
        <Loader/>
      ) : !allInstructorDetails || !allInstructorDetails.length ? (
        <p>
          No Data Available
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Instructor Info</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Date of Birth</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allInstructorDetails.map((instructor, index) => (
              <React.Fragment key={instructor._id}>
                <tr>
                  <td>{index + 1}</td>
                  <td className={styles['student-name']}>
                    <img
                      src={instructor.image}
                      alt="instructor"
                      className={styles['table-img']}
                    />
                    <div>
                      <p>{instructor.firstName}</p>
                      <p>{instructor.lastName}</p>
                    </div>
                  </td>
                  <td>{instructor.email}</td>
                  <td>{instructor.additionalDetails.gender || "Not defined"}</td>
                  <td>{instructor.additionalDetails.contactNumber || "No Data"}</td>
                  <td>{instructor.additionalDetails.dateOfBirth || "No Data"}</td>
                  <td>
                    <div>
                      <p>{instructor.active ? "Active" : "Inactive"}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="7">
                    <strong>Built Courses:</strong>
                    {instructor.courses && instructor.courses.length ? (
                      <div className={styles['purchased-courses']}>
                        {instructor.courses.map((course) => (
                          <div className={styles['courses-item']} key={course._id}>
                            <p><strong>Name:</strong> {course.courseName}</p>
                            <p><strong>Price:</strong> {course.price} $</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles['no-courses']}>No courses built</div>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

}

export default AllInstructors;
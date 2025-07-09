import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getAllStudentsData } from '../../../services/operations/adminApi'
import user_logo from "../../../assets/Images/user.png";


import styles from './profile.module.css'
import Loader from '../../common/Loader';

const AllStudents = () => {

    const { token } = useSelector(state => state.auth)
    const [allStudents, setAllStudents] = useState([])
    const [studentsCount, setStudentsCount] = useState();
    const [loading, setLoading] = useState(false)

    // fetch all Students Details
    useEffect(() => {
        const fetchAllStudents = async () => {
            setLoading(true)
            try {
            const { allStudentsDetails, studentsCount } = await getAllStudentsData(token)
            setAllStudents(allStudentsDetails)
            setStudentsCount(studentsCount)
            } catch (error) {
            console.error("Failed to fetch students:", error)
            } finally {
            setLoading(false) 
            }
        }

        fetchAllStudents()
    }, [token])




    return (
        <div className={`${styles.wrapper} ${styles.details}`}>
            <div className={styles.heading}>
                <h2 className={`${styles.title} secondary-title`}>All Students Details</h2>
                <strong>
                    Total students : {studentsCount}
                </strong>
            </div>
            <div className="table-wrapper">
                 {loading ? (
                        <Loader/>
                    ) : !allStudents ? (
                        <p>
                            No Data Available
                        </p>
                    ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student data</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Mobile</th>
                                <th>Date of birth</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allStudents.map((item, index) => (
                                <React.Fragment key={index}>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td className={styles['student-name']}>
                                    <img
                                        src={item.image !== "/" ? item.image : user_logo}
                                        alt="student"
                                        className={styles['table-img']}
                                    />
                                    <div>
                                        <p>{item.firstName}</p>
                                        <p>{item.lastName}</p>
                                    </div>
                                    </td>
                                    <td>{item.email}</td>
                                    <td>{item.additionalDetails.gender || "Not defined"}</td>
                                    <td>{item.additionalDetails.contactNumber || "No Data"}</td>
                                    <td>{item.additionalDetails.dateOfBirth || "No Data"}</td>
                                    <td>
                                    <div>
                                        <p>{item.active ? "Active" : "Inactive"}</p>
                                        <p>{item.approved ? "Approved" : "Not Approved"}</p>
                                    </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="7">
                                    <strong>User Purchased Courses:</strong>
                                    {item.courses && item.courses.length ? (
                                        <div className={styles['purchased-courses']}>
                                        {item.courses.map((course) => (
                                            <div className={styles['courses-item']} key={course._id}>
                                            <p><strong>Name:</strong> {course.courseName}</p>
                                            <p><strong>Price:</strong> {course.price} $</p>
                                            </div>
                                        ))}
                                        </div>
                                    ) : (
                                        <div className={styles['no-courses']}>Not Purchased any course</div>
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

export default AllStudents
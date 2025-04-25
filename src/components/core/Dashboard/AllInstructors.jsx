import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAllInstructorDetails } from "../../../services/operations/adminApi";





// loading skeleton
const LoadingSkeleton = () => {
  return (<div className="flex p-5 flex-col gap-6 border-b border-2 border-b-richblack-500">
    <div className="flex flex-col sm:flex-row gap-5 items-center mt-7">
      <p className='h-[75px] w-[75px] rounded-full mr-10skeleton'></p>
      <div className="flex flex-col gap-2 ">
        <p className='h-4 w-[160px] rounded-xl skeleton'></p>
        <p className='h-4 w-[270px] rounded-xl skeleton'></p>
        <p className='h-4 w-[100px] rounded-xl skeleton'></p>
      </div>
    </div>
    <div className='flex gap-5'>
      <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
      <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
      <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
    </div>
  </div>)
}


function AllInstructors() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [allInstructorDetails, setAllInstructorDetails] = useState([]);
  const [instructorsCount, setInstructorsCount] = useState();
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    const fetchInstructorsData = async () => {
      setLoading(true)
      const { allInstructorsDetails, instructorsCount } = await getAllInstructorDetails(token);
      if (allInstructorsDetails) {
        setAllInstructorDetails(allInstructorsDetails);
        setInstructorsCount(instructorsCount)
      }
      setLoading(false)
    };

    fetchInstructorsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-14 flex items-center justify-between text-white">
        <h1 className="sm:text-4xl text-xl font-medium text-white font-wadik text-center sm:text-left">All Instructors Details</h1>
      </div>
      <div className="rounded-xl">
        <div className="flex gap-x-10 rounded-t-md px-6 py-2 border-b border-gray">
            <div className="flex-1 text-left text-sm font-medium uppercase">
              Instructors : {instructorsCount}
            </div>
        </div>
        <div>
          {
            loading ? <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
              // if No Data Available
              :
              !allInstructorDetails ? <div className='text-5xl py-5 bg-yellow-800 text-white text-center'>No Data Available</div>
                :
                allInstructorDetails?.map((instructor) => (
                  <div
                    key={instructor._id}
                    className="border-x border border-gray">
                    <div className="flex sm:flex-row flex-col sm:items-start items-end flex-col gap-x-10 px-6 pt-8 pb-2 border-b border-gray">
                      <div className="flex flex-1 gap-x-2 ml-0 mr-auto">
                        <img
                          src={instructor.image}
                          alt="student"
                          className="sm:h-[75px] sm:w-[75px] rounded-full sm:mr-10 mr-5 h-[50px] :w-[50px]"
                        />
                        <div className='text-sm font-normal'>
                          <p className='text-base font-bold'>{instructor.firstName + " " + instructor.lastName}</p>
                          <p className="mb-5">{instructor.email}</p>
                          <p>
                            Gender:{" "}
                            {instructor.additionalDetails.gender
                              ? instructor.additionalDetails.gender
                              : "Not define"}
                          </p>
                          <p>
                            Mobile No:{" "}
                            {instructor.additionalDetails.contactNumber
                              ? instructor.additionalDetails.contactNumber
                              : "No Data"}
                          </p>
                          <p>
                            DOB:{" "}
                            {instructor.additionalDetails.dateOfBirth
                              ? instructor.additionalDetails.dateOfBirth
                              : "No Data"}
                          </p>
                        </div>
                      </div>
                      <div className="sm:mr-[11.5%] mr-0 text-sm font-medium">
                        {instructor.active ? "Active" : "Inactive"}
                      </div>
                      <div className="mr-0 sm:mr-[8%] text-sm font-medium">
                        {instructor.approved ? "Approved" : "Not Approved"}
                      </div>
                    </div>


                    {instructor.courses.length ? (
                      <div className="flex sm:flex-row flex-col gap-x-10 px-6 py-5">
                       <p className="text-yellow-50 text-sm font-bold mr-8">Built Courses:</p>
                        <div className="sm:grid grid-cols-5 gap-y-5 flex sm:flex-row flex-col">
                          {instructor.courses.map((course) => (
                            <div className="text-white text-sm" key={course._id}>
                              <p>{course.courseName}</p>
                              <p className="text-sm font-normal">Price:{course.price}  $</p>
                            </div>
                          ))}
                        </div>
                      </div>)
                      :
                      <div className="px-6 my-4 text-sm text-gray">Not Purchased any course</div>
                    }
                  </div>

                ))}
          </div>
      </div>
    </div>
  );
}

export default AllInstructors;
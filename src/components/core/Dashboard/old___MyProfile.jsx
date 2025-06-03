import { useEffect } from "react"
import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"
import Img from './../../common/Img';



export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate();


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <>
      <h1 > My Profile</h1>

      <div className="flex sm:items-center items-start justify-between rounded-2xl   p-8 px-7 sm:px-12 bg-blue-500">
        <div className="flex sm:items-center items-start gap-x-4 sm:flex-row flex-col">
          <Img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[68px] rounded-full object-cover sm:mb-0 mb-3 z-10 relative"
          />
          <div className="space-y-1">
            <p className="text-sm sm:text-lg font-semibold text-white capitalize">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm font-thin">{user?.email}</p>
          </div>
        </div>

        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      <div className="my-10 flex justify-between sm:items-center items-start gap-y-10 rounded-2xl   p-8 px-7 sm:px-12 bg-blue-500">
        <div className="w-full">
          <p className="text-lg font-semibold text-white">About</p>
          <p
            className={`${user?.additionalDetails?.about
              ? "text-white"
              : ""
              } text-sm font-medium font-thin`}
          >
            {user?.additionalDetails?.about ?? "Write Something About Yourself"}
          </p>
        </div>
        <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
       
      </div>

      <div className="my-10 flex flex-col gap-y-10 rounded-2xl   p-8 px-7 sm:px-12 bg-blue-500">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-white">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="flex max-w-[500px] justify-between ">
          <div className="flex flex-col gap-y-5">

            <div>
              <p className="mb-2 text-xs font-thin text-yellow-100 font-bold  ">First Name:</p>
              <p className="text-sm text-white capitalize font-thin">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-thin text-yellow-100 font-bold  ">Account Type:</p>
              <p className="text-sm text-white capitalize font-thin">
                {user?.accountType}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-thin text-yellow-100 font-bold  ">Email:</p>
              <p className="text-sm font-thin text-white  break-words break-all mr-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-thin text-yellow-100 font-bold  ">Gender:</p>
              <p className="text-sm font-thin text-white">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-xs font-thin text-yellow-100 font-bold  ">Last Name:</p>
              <p className="text-sm text-white capitalize font-thin">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-thin text-yellow-100 font-bold  ">Phone Number:</p>
              <p className="text-sm font-thin text-white">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-thin text-yellow-100 font-bold  ">Date Of Birth:</p>
              <p className="text-sm font-thin text-white">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
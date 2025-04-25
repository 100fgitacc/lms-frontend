import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPI"
import Img from './../../common/Img';


export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null
  // console.log('user data from store = ', user )



  return (

    // only for large devices

    <button className="relative hidden sm:flex" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <Img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className={'aspect-square w-[30px] rounded-full object-cover'}
        />
        <AiOutlineCaretDown className="text-sm " />
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[120%] right-[-15px] z-[1000] divide-y-[1px]  divide-gray overflow-hidden rounded-md bg-blue-600 border-[1px] border-gray"
          ref={ref}
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm  hover:bg-blue-400 hover:text-black text-white">
              <VscDashboard className="text-lg"/>
              Dashboard
            </div>
          </Link>

          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm  text-white hover:text-black hover:bg-blue-400"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  )
}
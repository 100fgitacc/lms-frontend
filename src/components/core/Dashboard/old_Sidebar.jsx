import { useEffect, useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from '../../../../data/dashboard-links';
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"
import Loading from '../../common/Loader';

import { HiMenuAlt1 } from 'react-icons/hi'
import { IoMdClose } from 'react-icons/io'

import { setOpenSideMenu, setScreenSize } from "../../../slices/sidebarSlice";




export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)


  // handle side bar menu - open / close
  // const [openSideMenu, setOpenSideMenu] = useState(false)
  // const [screenSize, setScreenSize] = useState(undefined)

  const { openSideMenu, screenSize } = useSelector((state) => state.sidebar)
  // console.log('openSideMenu ======' , openSideMenu)
  // console.log('screenSize ======' , screenSize)

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth))

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // If screen size is small then close the side bar
  useEffect(() => {
    if (screenSize <= 640) {
      dispatch(setOpenSideMenu(false))
    }
    else dispatch(setOpenSideMenu(true))
  }, [screenSize])



  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 ">
        <Loading />
      </div>
    )
  }
  
  return (
    <>
      <div className="md:hidden text-white absolute  left-5 top-[15px] cursor-pointer z-40" onClick={() => dispatch(setOpenSideMenu(!openSideMenu))}>
        {
          openSideMenu ? <IoMdClose size={33} /> : <HiMenuAlt1 size={33} />
        }
      </div>


      {
        openSideMenu &&
        <div className={`md:relative fixed top-0 left-0 bottom-0 z-10 md:z-0  w-[240px] transition-all duration-300
          ${openSideMenu ? 'translate-x-0' : '-translate-x-full'} bg-blue-600 py-10 border-r border-gray mt-[50px]`}
          style={{ height: 'calc(100vh - 50px)' }}
        >

        <div className="flex flex-col mt-6">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} setOpenSideMenu={setOpenSideMenu} />
            )
          })}
        </div>
      
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12" />
      
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName={"VscSettingsGear"}
            setOpenSideMenu={setOpenSideMenu}
          />
      
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure ?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className=" "
          >
            <div className="flex items-center gap-x-2 px-8 py-2 text-sm font-medium hover:opacity-70 text-white relative">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      }


      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
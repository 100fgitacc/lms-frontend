import * as Icons from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../../slices/courseSlice"
import { setOpenSideMenu } from "../../../../slices/sidebarSlice"
import styles from './sidebar.module.css'



export default function SidebarLink({ link, iconName }) {

  const isHidden = useSelector((state) => state.sidebar.isSidebarHidden);
  const location = useLocation()
  const dispatch = useDispatch()

  const { openSideMenu, screenSize } = useSelector(state => state.sidebar)
  

  const handleClick = () => {
    dispatch(resetCourseState())
    if (openSideMenu && screenSize <= 640) dispatch(setOpenSideMenu(false))
  }

  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      className={`${styles['menu-item']} ${link.path === location.pathname? styles.active : '' }`}
    >
      <div className={styles.icon}>
        <img src={`/assets/img/icons/${iconName}.png`} alt='icon' />
      </div>
      {!isHidden && <p>{link.name}</p>}

    </NavLink>
  )
}
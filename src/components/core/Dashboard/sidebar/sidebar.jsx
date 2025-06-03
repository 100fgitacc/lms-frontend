import React, { useState, useEffect } from 'react';
import styles from './sidebar.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenSideMenu, toggleSidebar, resetSidebar } from "../../../../slices/sidebarSlice";
import SidebarLink from "./SidebarLink"
import { sidebarLinks } from '../../../../../data/dashboard-links';
import ConfirmationModal from "../../../common/ConfirmationModal"
import { logout } from "../../../../services/operations/authAPI"


const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading: profileLoading } = useSelector((state) => state.profile)
  const isHidden = useSelector((state) => state.sidebar.isSidebarHidden);

  const handleToggleSidebar = () => {
    if (!isHidden) {
        dispatch(toggleSidebar());
    }else{
        dispatch(resetSidebar());
    }
  };
  const handleConfirmationModal = () => {
    const modalData = {
      text1: "Are you sure ?",
      text2: "You will be logged out of your account.",
      btn1Text: "Logout",
      btn2Text: "Cancel",
      btn1Handler: () => dispatch(logout(navigate))
    }
   
  };
const [confirmationModal, setConfirmationModal] = useState(null)



    return (
    <div className={`${styles.sidebar} ${isHidden ? styles.hide : ''} `}>
        <div className={styles['logo-container']}>
          {!isHidden ?(
              <>
                  <div className={`${styles.logo} main-logo`}> 
                      <img  src='/assets/img/logo-new-2.png' alt='logo'/>
                  </div>
                  <button className={styles['sidebar-button-close']} onClick={handleToggleSidebar}><img src='/assets/img/icons/chevron-right.png' alt='logo'/></button>
              </>
          ):(
              <button className={styles['sidebar-button-open']} onClick={handleToggleSidebar}>
                  <img src='/assets/img/icons/menu.png' alt='logo'/>
              </button>
              )
          }
        </div>
        
        <div className={styles.menu}>
          {!isHidden && 
            <li className={`${styles['menu-item']}`}>
                <p>Managment</p>
            </li>
          }
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
        </div>
      
        <div className={styles.menu}>
          {!isHidden && 
            <li className={`${styles['menu-item']}`}>
                <p>Settings</p>
            </li>
          }
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName={"settings"}
            setOpenSideMenu={setOpenSideMenu}
          />

         
          <li
            onClick={() => handleConfirmationModal() }
            className={styles['menu-item']}
          >
          <div className={styles.icon}>
            <img src='/assets/img/icons/log-out.png' alt='icon'/>
          </div>
          {!isHidden && 
            <p 
              onClick={() => setConfirmationModal({
                text1: "Are you sure ?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })}
            >Logout</p>
          }
          </li>
        </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}

    </div>
  )











}

export default Sidebar;
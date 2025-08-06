import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import styles from './index.module.css';

import { NavbarLinks } from '../../../../data/header-links';
import useOnClickOutside from '../../../hooks/useOnClickOutside';
import Img from './../../common/Img';
import { fetchCourseCategories } from '../../../services/operations/courseDetailsAPI';
import { logout } from "../../../services/operations/authAPI"


import { MdShoppingCart, MdEdit } from 'react-icons/md';
const Header = () => {

   
    const isHidden = useSelector((state) => state.sidebar.isSidebarHidden);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart)
    const location = useLocation();
    
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSublinks = async () => {
        try {
            setLoading(true)
            const res = await fetchCourseCategories();
            setSubLinks(res);
        }
        catch (error) {
            console.log("Could not fetch the category list = ", error);
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSublinks();
    }, [])


    const [isCatalog, setisCatalog] = useState(false);

    useEffect(() => {
        if (location.pathname.includes("/catalog") || location.pathname.includes("/courses")) {
            setisCatalog(true);
        }else{
            setisCatalog(false);
        }
      }, []);
    

    const [openProfileMenu, setOpenProfileMenu] = useState(false)
    const [openSublinksMenu, setOpenSublinksMenu] = useState(false)
    const profileRref = useRef(null)
    const sublinksRref = useRef(null)

    useOnClickOutside(profileRref, () => setOpenProfileMenu(false))
    useOnClickOutside(sublinksRref, () => setOpenSublinksMenu(false))


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const primaryWallet = useSelector((state) => state.wallet.primaryWallet)

      
    return(
        <nav className={`${styles.wrapper} ${isHidden && styles['full-width']}`}>
            
            <ul className={styles.menu}>
                {
                    NavbarLinks.map((link, index) => (
                         <li key={index} className={`${styles['menu-item']}`}
                         onClick={link.title === 'All Courses' ? () => setOpenSublinksMenu(true) : undefined}
                         >
                            {
                                link.title === "All Courses" ? (
                                    <>
                                        <p>{link.title}</p>
                                        {openSublinksMenu && (
                                            <div ref={sublinksRref} className={`${styles['dropdown']} ${styles['dropdown-menu']}`}>
                                                {loading ? (<p className="">Loading...</p>)
                                                    : subLinks.length ? (
                                                        <>
                                                            {subLinks?.map((subLink, i) => (
                                                                <Link
                                                                    to={`/catalog/${subLink.name
                                                                        .split(" ")
                                                                        .join("-")
                                                                        .toLowerCase()}`}
                                                                    className={styles['dropdown-links']}
                                                                    key={i}
                                                                >
                                                                    <p>{subLink.name}</p>
                                                                </Link>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <p className="">No Courses Found</p>
                                                    )}
                                            </div>
                                        )
                                        }
                                    </>
                                ) : (
                                <Link to={link?.path}>
                                    <p className={``}>
                                        {link.title}
                                    </p>
                                </Link>)
                            }
                        </li>
                    ))
                }
            </ul>
            <div className={`${token === null && 'hidden' } `}>
                {
                    user && user?.accountType === "Student" && (
                        <Link to="/dashboard/cart" className={styles['cart']}>
                            {totalItems > 0 && (
                                <div className={styles['cart-button']}>
                                    <MdShoppingCart  
                                    size={24} color="#333333" />
                                    <span className={styles['cart-count']}>
                                        {totalItems}
                                    </span>
                                </div>
                            )}
                        </Link>
                    )
                }
            </div>
            <div className={`${token === null && 'hidden' } `}>
              
                {token !== null &&
                   <div className={styles['profile-settings']}>
                            <div className={styles['user-data']}>
                                <Img
                                src={user?.image}
                                alt={`profile-${user?.firstName}`}
                                className={''}
                                />
                               <div>
                                    <p>{user?.firstName}</p>
                                    {primaryWallet?.address ?  (
                                        <span>
                                            {primaryWallet?.address?.slice(0, 6)}...{primaryWallet?.address?.slice(-4)}
                                            <button className={styles['edit-wallet-btn']} onClick={() => navigate("/dashboard/my-profile")}>
                                                <MdEdit  size={9} color="#333333" />
                                            </button>
                                        </span>
                                    ) : (
                                        <small>No wallets connected</small>
                                    )}
                               </div>
                            </div>
                            <span className={styles['menu-arrow']}  onClick={() => setOpenProfileMenu(true)}></span>
                           
                             {openProfileMenu && (
                            <div onClick={(e) => e.stopPropagation()} className={`${styles['dropdown'] }`} ref={profileRref}>
                                <Link to="/dashboard/my-profile" onClick={() => setOpen(false)} className={styles['dropdown-links']}>
                                    Dashboard
                                </Link>
                                <a onClick={() => {dispatch(logout(navigate)); setOpen(false)}} className={styles['dropdown-links']}>
                                    Logout
                                </a>
                            </div>
                        )}
                        </div>
                }

            </div>
        </nav>
    );
}

export default Header;
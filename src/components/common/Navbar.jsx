import React, { useState, useEffect } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

// import { NavbarLinks } from "../../../data/navbar-links"
import studyNotionLogo from '../../assets/Logo/Logo-Full-Light-2.png'
import { fetchCourseCategories } from './../../services/operations/courseDetailsAPI';

import ProfileDropDown from '../core/Auth/ProfileDropDown'
import MobileProfileDropDown from '../core/Auth/MobileProfileDropDown'

import { AiOutlineShoppingCart } from "react-icons/ai"
import { MdKeyboardArrowDown } from "react-icons/md"




const Navbar = () => {
    // console.log("Printing base url: ", import.meta.env.VITE_APP_BASE_URL);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    // console.log('USER data from Navbar (store) = ', user)
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


    // when user click Navbar link then it will hold yellow color
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }


    // when user scroll down , we will hide navbar , and if suddenly scroll up , we will show navbar 
    const [showNavbar, setShowNavbar] = useState('top');
    const [lastScrollY, setLastScrollY] = useState(0);
    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        }
    },)

    // control Navbar
    const controlNavbar = () => {
        // if (window.scrollY > 200) {
        //     if (window.scrollY > lastScrollY)
        //         setShowNavbar('hide')

        //     else setShowNavbar('show')
        // }

        // else setShowNavbar('top')

        setLastScrollY(window.scrollY);
    }

    const [isCatalog, setisCatalog] = useState(false);

    useEffect(() => {
        if (location.pathname.includes("/catalog") || location.pathname.includes("/courses")) {
            setisCatalog(true);
        }else{
            setisCatalog(false);
        }
      }, []);
    


    return (
        // <nav className={`z-10 flex h-14 w-full items-center justify-center border-b-[1px] border-b-gray text-white translate-y-0 transition-all ${showNavbar} `}>
             <nav className={` fixed flex items-center justify-center w-full h-16 z-[30] translate-y-0 transition-all text-white ${showNavbar} border-b border-gray`}>
            <div className={`${token === null && 'justify-between' } flex w-11/12 max-w-maxContent items-center ${!isCatalog ? 'justify-end' : 'justify-between'} md:justify-between `}>
                {/* logo */}
                <Link to="/" className="">
                    <img src={studyNotionLogo} width={125} height={42} loading='lazy' />
                </Link>
        
                {/* Nav Links - visible for only large devices*/}
                <ul className=' sm:flex gap-x-6 '>
                    {
                        NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {
                                    link.title === "Course catalog" ? (
                                        <div
                                            className={`sm:ml-20 md:mr-10 md:ml-30 ml-0 mr-0 group relative flex cursor-pointer items-center gap-1 text-sm ${matchRoute("/catalog/:catalogName")
                                                ? "bg-yellow-25 text-black rounded-xl p-1 px-3"
                                                : " rounded-xl p-1 px-3 "
                                                }`}
                                        >
                                            <p>{link.title}</p>
                                            <MdKeyboardArrowDown />
                                            {/* drop down menu */}
                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] 
                                                    flex-col rounded-lg  p-4  opacity-0 transition-all duration-150 group-hover:visible 
                                                    group-hover:translate-y-[1.85em] group-hover:opacity-100 lg:w-[300px]
                                                    bg-blue-600 text-white shadow-[0_4px_4px_#ffeb3b14] border border-yellow-100
                                                    "
                                            >
                                              
                                                {loading ? (<p className="text-center ">Loading...</p>)
                                                    : subLinks.length ? (
                                                        <>
                                                            {subLinks?.map((subLink, i) => (
                                                                <Link
                                                                    to={`/catalog/${subLink.name
                                                                        .split(" ")
                                                                        .join("-")
                                                                        .toLowerCase()}`}
                                                                    className="bg-transparent py-4 pl-4 hover:0 hover:bg-blue-400 hover:text-black text-sm border-b border-gray"
                                                                    key={i}
                                                                >
                                                                    <p>{subLink.name}</p>
                                                                </Link>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <p className="text-center">No Courses Found</p>
                                                    )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path) ? "bg-yellow-25 text-black" : ""} rounded-xl p-1 px-3 `}>
                                                {link.title}
                                            </p>
                                        </Link>)
                                }
                            </li>
                        ))
                    }
                </ul>




              
            </div>
        </nav>
    )
}

export default Navbar

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from "react-router-dom"
import Loading from '../components/common/Loading'
import styles from './dashboard.module.css'
import Header from '../components/common/header/header'
import Sidebar from '../components/core/Dashboard/sidebar/sidebar'

const Dashboard = () => {

    const { loading: authLoading } = useSelector((state) => state.auth);
    const { loading: profileLoading } = useSelector((state) => state.profile);
    const isHidden = useSelector((state) => state.sidebar.isSidebarHidden);

    if (profileLoading || authLoading) {
        return (
            <div>
                <Loading />
            </div>
        )
    }
    // Scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])


    return (
        <div className='page-template'>
            <Sidebar/>
            <div className={`content ${isHidden ? styles['full-width'] : ''}`}>
                <Header/>
                <div className={`content-inner`}>
                    <Outlet />
                </div>
            </div>
            
            {/* {confirmationModal && <ConfirmationModal modalData={confirmationModal} />} */}
        </div>
    )
}

export default Dashboard

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'
import Loading from '../components/common/Loading'

const Dashboard = () => {

    const { loading: authLoading } = useSelector((state) => state.auth);
    const { loading: profileLoading } = useSelector((state) => state.profile);


    if (profileLoading || authLoading) {
        return (
            <div className='mt-10'>
                <Loading />
            </div>
        )
    }
    // Scroll to the top of the page when the component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className='relative flex min-h-[calc(100vh)] bg-blue-800'>
            <Sidebar />

            <div className='h-[calc(100vh)] overflow-auto w-full bg-blue-800'>
                <div className='sm:p-10 p-5 mt-[100px]'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard

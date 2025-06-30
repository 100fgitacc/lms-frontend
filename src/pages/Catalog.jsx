import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import Course_Card from '../components/core/Catalog/Course_Card'
import Loader from '../components/common/Loader';

import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import { fetchCourseCategories } from './../services/operations/courseDetailsAPI';

import styles from './catalog.module.css'
import Sidebar from "../components/core/Dashboard/sidebar/sidebar"
import Header from "../components/common/header/header"


function Catalog() {

    const { catalogName } = useParams()
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [categoryId, setCategoryId] = useState("")
    const [loading, setLoading] = useState(true);
    const isHidden = useSelector((state) => state.sidebar.isSidebarHidden);
    useEffect(() => {
        ; (async () => {
            try {
                const res = await fetchCourseCategories();
                const category_id = res.filter(
                    (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
                )[0]._id
                setCategoryId(category_id)
            } catch (error) {
                console.log("Could not fetch Categories.", error)
            }
        })()
    }, [catalogName])
    useEffect(() => {
        if (categoryId) {
            ; (async () => {
                setLoading(true)
                try {
                    const res = await getCatalogPageData(categoryId)
                    setCatalogPageData(res)
                } catch (error) {
                    console.log(error)
                }
                setLoading(false)
            })()
        }
    }, [categoryId])

    if (loading) {
    return (
        <div className="page-template">
        <Sidebar />
        <div className={`content ${styles['course-overview']} ${styles['lesson-content']} ${isHidden ? 'full-width' : ''}`}>
            <Header />
            <Loader type={'fullscreen'} />
        </div>
        </div>
    )
    }

    if (!loading && !catalogPageData) {
    return (
        <div className="page-template">
        <Sidebar />
        <div className={`content ${styles['course-overview']} ${styles['lesson-content']} ${isHidden ? 'full-width' : ''}`}>
            <Header />
            <div className={styles.wrapper}>
            <div className={styles['catalog-heading']}>
                <p className={styles['no-courses-text']}>No Courses found for selected Category</p>
            </div>
            </div>
        </div>
        </div>
    )
    }
        
   

    return (
        <div className='page-template'>
            <Sidebar/>
            <div className={`content ${styles['course-overview']} ${styles['lesson-content']} ${isHidden? 'full-width': ''} `}>
            <Header/>
            <div className={styles.wrapper}>
                <div className={styles['catalog-heading']}>
                    <h1 className="">
                        {catalogPageData?.selectedCategory?.name}
                    </h1>
                    <p className="">
                        {catalogPageData?.selectedCategory?.description}
                    </p>
                </div>
                <div className={styles.inner}>
                    <h3 className={styles.heading}>All courses in this category</h3>
                    <div className={styles['projects-wrapper']}>
                        {catalogPageData?.selectedCategory?.courses.map((course, i) => (
                            <Course_Card course={course} key={i}/>
                        )).reverse()}
                    </div>
                </div>
                <div className={styles.inner}>
                    {catalogPageData?.differentCategory && (
                        <h3 className={styles.heading}>
                            Top 3 courses in: "{catalogPageData?.differentCategory?.name}" 
                        </h3>
                    )}
                    <div className={styles['projects-wrapper']}>
                        {catalogPageData?.mostSellingCourses.slice(0, 3).map((course, i) => (
                            <Course_Card course={course} key={i} Height="" />
                        ))}
                    </div>
                </div>
                <div className={styles.inner}>
                    <h3 className={styles.heading}>You May Also Like:</h3>
                    <div className={styles['projects-wrapper']}>
                        {catalogPageData?.mostSellingCourses
                                ?.slice(0, 4).map((course, i) => (
                            <Course_Card course={course} key={i} Height="" />
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Catalog

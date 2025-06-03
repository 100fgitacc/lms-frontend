import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

// import CourseCard from "../components/Catalog/CourseCard"
// import CourseSlider from "../components/Catalog/CourseSlider"
import Footer from "../components/common/Footer"
import Course_Card from '../components/core/Catalog/Course_Card'
import Course_Slider from "../components/core/Catalog/Course_Slider"
import Loading from './../components/common/Loading';

import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import { fetchCourseCategories } from './../services/operations/courseDetailsAPI';

import styles from './catalog.module.css'


function Catalog() {

    const { catalogName } = useParams()
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [categoryId, setCategoryId] = useState("")
    const [loading, setLoading] = useState(false);

    // Fetch All Categories
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

    // console.log('======================================= ', catalogPageData)
    // console.log('categoryId ==================================== ', categoryId)

    if (loading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-blue-800">
                <Loading />
            </div>
        )
    }
    if (!loading && !catalogPageData) {
        return (
            <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
                No Courses found for selected Category
            </div>)
    }
    
    console.log(catalogPageData.mostSellingCourses
);
    

    return (
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
                    ))}
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
    )
}

export default Catalog

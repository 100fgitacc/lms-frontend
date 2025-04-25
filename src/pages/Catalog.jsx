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


    return (
        <>
            <div className="px-4 mt-[100px]">
                <div className="mx-auto flex min-h-[160px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className="text-3xl text-white font-wadik text-2xl text-center">
                        {catalogPageData?.selectedCategory?.name}
                    </p>
                    <p className="max-w-[870px] text-center mr-auto ml-auto font-thin">
                        {catalogPageData?.selectedCategory?.description}
                    </p>
                </div>
            </div>
            <div className="mx-auto  w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <p className="font-wadik text-xl">All courses in this category</p>
                <div className="py-8">
                    <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                    {catalogPageData?.selectedCategory?.courses.map((course, i) => (
                        <Course_Card course={course} key={i} Height="h-[300px]" />
                    ))}
                    </div>
                </div>
            </div>
            <div className=" mx-auto  w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                {catalogPageData?.differentCategory && (
                    <div className="font-wadik text-xl">
                        Top 3 courses in: "{catalogPageData?.differentCategory?.name}" 
                    </div>
                )}
              
                <div className="py-8">
                    <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                    {catalogPageData?.differentCategory?.courses.slice(0, 3).map((course, i) => (
                        <Course_Card course={course} key={i} Height="h-[300px]" />
                    ))}
                    </div>
                </div>
            </div>
            <div className=" mx-auto  w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="font-wadik text-xl">You May Also Like:</div>
                <div className="py-8">
                    <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
                    {catalogPageData?.mostSellingCourses
                            ?.slice(0, 4).map((course, i) => (
                        <Course_Card course={course} key={i} Height="h-[300px]" />
                    ))}
                    </div>
                </div>
            </div>

            {/* <Footer /> */}
        </>
    )
}

export default Catalog

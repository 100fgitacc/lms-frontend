
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import SignupForm from "./components/core/Auth/SignupForm"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import CourseDetails from './pages/CourseDetails';
import Catalog from './pages/Catalog';

import Navbar from "./components/common/Navbar"

import OpenRoute from "./components/core/Auth/OpenRoute"
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Profile from "./components/core/Dashboard/profile";
import Settings from "./components/core/Dashboard/Settings/Settings";
import MyCourses from './components/core/Dashboard/MyCourses';
import EditCourse from './components/core/Dashboard/EditCourse/EditCourse';
import Instructor from './components/core/Dashboard/Instructor';


import Cart from "./components/core/Dashboard/Cart/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";

import CoursePage from "./pages/CoursePage";
import VideoDetails from './components/core/ViewCourse/VideoDetails';

import { ACCOUNT_TYPE } from './utils/constants';

import { HiArrowNarrowUp } from "react-icons/hi"
import CreateCategory from "./components/core/Dashboard/CreateCategory";
import AllStudents from './components/core/Dashboard/AllStudents';
import AllStudentsByInstructor from './components/core/Dashboard/AllStudentsByInstructor';
import AllInstructors from './components/core/Dashboard/AllInstructors';
import LoginForm from "./components/core/Auth/LoginForm";


function App() {

  const { user } = useSelector((state) => state.profile)

  // Scroll to the top of the page when the component mounts
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname])

  useEffect(() => {
    scrollTo(0, 0);
  }, [location])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  // Go upward arrow - show , unshow
  const [showArrow, setShowArrow] = useState(false)

  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true)
    } else setShowArrow(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleArrow);
    return () => {
      window.removeEventListener('scroll', handleArrow);
    }
  }, [showArrow])


  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/"  
          element={
            <OpenRoute>
              <LoginPage />
            </OpenRoute>
        } />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="login" element={
            <OpenRoute>
              <LoginForm />
            </OpenRoute>
          }
        />
        <Route
          path="signup" element={
            <OpenRoute>
              <SignupForm />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password" element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email" element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id" element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />



        {/* Protected Route - for Only Logged in User */}
        {/* Dashboard */}
        <Route element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        >
          <Route path="dashboard/my-profile" element={<Profile />} />
          <Route path="dashboard/Settings" element={<Settings />} />

          {/* Route only for Admin */}
          {/* create category, all students, all instructors */}
          {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="dashboard/create-category" element={<CreateCategory />} />
              <Route path="dashboard/all-students" element={<AllStudents />} />
              <Route path="dashboard/all-instructors" element={<AllInstructors />} />
            </>
          )}


          {/* Route only for Students */}
          {/* cart , EnrolledCourses */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
            </>
          )}

          {/* Route only for Instructors */}
          {/* add course , MyCourses, EditCourse*/}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
               <Route path="dashboard/all-students-by-instructor" element={<AllStudentsByInstructor />} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
            </>
          )}
        </Route>


        {/* For the watching course lectures */}
        <Route
          element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          )}
        </Route>




        {/* Page Not Found (404 Page ) */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>

    </>
  );
}

export default App;

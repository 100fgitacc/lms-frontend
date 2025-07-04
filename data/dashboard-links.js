import { ACCOUNT_TYPE } from './../src/utils/constants';

export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "user",
  },
  {
    id: 2,
    name: "Statistics",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "dashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "to-do-list",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "add-file",
  },
  {
    id: 5,
    name: "All Students",
    path: "/dashboard/all-students-by-instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "student",
  },
  {
    id: 6,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "enroll",
  },
  {
    id: 7,
    name: "Create Category",
    path: "/dashboard/create-category",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "edit",
  },
  {
    id: 8,
    name: "All Students",
    path: "/dashboard/all-students",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "students",
  },
  {
    id: 9,
    name: "All Instructors",
    path: "/dashboard/all-instructors",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "teacher",
  },

];

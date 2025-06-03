import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    openSideMenu: false,
    screenSize: undefined,
    isSidebarHidden: false,
    // course view side bar
    courseViewSidebar: false,
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setOpenSideMenu: (state, action) => {
            // console.log('action.payload == ', action.payload)
            state.openSideMenu = action.payload
        },
        setScreenSize: (state, action) => {
            state.screenSize = action.payload
        },
        setCourseViewSidebar: (state, action) => {
            state.courseViewSidebar = action.payload
        },
        toggleSidebar: (state) => {
            state.isSidebarHidden = !state.isSidebarHidden;
        },
        resetSidebar: (state) => {
            state.isSidebarHidden = !state.isSidebarHidden;
        },

    }
})

export const { setOpenSideMenu, setScreenSize, setCourseViewSidebar,toggleSidebar, resetSidebar } = sidebarSlice.actions

export default sidebarSlice.reducer




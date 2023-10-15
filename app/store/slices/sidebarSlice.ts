"use client"

/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit"

// Define a type for the slice state
interface Sidebar {
  isOpen: boolean
}

// Define the initial state using that type
const initialState: Sidebar = {
  isOpen: false,
}

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openSidebar: state => {
      state.isOpen = true
    },
    closeSidebar: state => {
      state.isOpen = false
    },
  },
})

export const { openSidebar, closeSidebar } = sidebarSlice.actions

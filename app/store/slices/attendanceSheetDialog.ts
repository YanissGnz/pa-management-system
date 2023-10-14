"use client"

/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Define a type for the slice state
interface AttendanceSheetDialog {
  id: string | null
  isOpen: boolean
}

// Define the initial state using that type
const initialState: AttendanceSheetDialog = {
  id: null,
  isOpen: false,
}

export const attendanceSheetDialog = createSlice({
  name: "deleteDialog",
  initialState,
  reducers: {
    openAttendanceSheetDialog: (state, action: PayloadAction<string>) => {
      state.id = action.payload
      state.isOpen = true
    },
    closeAttendanceSheetDialog: state => {
      state.id = null
      state.isOpen = false
    },
  },
})

export const { closeAttendanceSheetDialog, openAttendanceSheetDialog } =
  attendanceSheetDialog.actions

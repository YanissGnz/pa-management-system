"use client"

/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { TStudentSchema } from "@/types/Student"

interface StudentDetailsDialog {
  student: TStudentSchema | null
  isOpen: boolean
}

const initialState: StudentDetailsDialog = {
  student: null,
  isOpen: false,
}

export const studentDetailsSlice = createSlice({
  name: "studentDetails",
  initialState,
  reducers: {
    openStudentDetails: (state, action: PayloadAction<TStudentSchema>) => {
      state.student = action.payload
      state.isOpen = true
    },
    closeStudentDetails: state => {
      state.student = null
      state.isOpen = false
    },
  },
})

export const { openStudentDetails, closeStudentDetails } = studentDetailsSlice.actions

"use client"

/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Define a type for the slice state
interface AssignStudentsDialog {
  id: string | null
  isOpen: boolean
}

// Define the initial state using that type
const initialState: AssignStudentsDialog = {
  id: null,
  isOpen: false,
}

export const assignStudentsDialog = createSlice({
  name: "assignStudentsDialog",
  initialState,
  reducers: {
    openAssignStudentsDialog: (state, action: PayloadAction<string>) => {
      state.id = action.payload
      state.isOpen = true
    },
    closeAssignStudentsDialog: state => {
      state.id = null
      state.isOpen = false
    },
  },
})

export const { closeAssignStudentsDialog, openAssignStudentsDialog } = assignStudentsDialog.actions

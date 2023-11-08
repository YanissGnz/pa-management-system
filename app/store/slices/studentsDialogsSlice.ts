"use client"

/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Define a type for the slice state
interface AssignDialog {
  id: string | null
  isOpen: boolean
}

// Define the initial state using that type
const initialState: AssignDialog = {
  id: null,
  isOpen: false,
}

export const studentDialogs = createSlice({
  name: "studentDialogs",
  initialState,
  reducers: {
    openAssignDialog: (state, action: PayloadAction<string>) => {
      state.id = action.payload
      state.isOpen = true
    },
    closeAssignDialog: state => {
      state.id = null
      state.isOpen = false
    },
   

  },
})

export const { closeAssignDialog, openAssignDialog ,} = studentDialogs.actions

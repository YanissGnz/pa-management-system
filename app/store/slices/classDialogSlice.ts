"use client"

/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Define a type for the slice state
interface AssignStudentsDialog {
  id: string | null
  isOpen: boolean
  isOpenEndDialog: boolean,
}

// Define the initial state using that type
const initialState: AssignStudentsDialog = {
  id: null,
  isOpen: false,
  isOpenEndDialog: false,
}

export const classDialogs = createSlice({
  name: "classDialogs",
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
     openEndClassDialog: (state, action: PayloadAction<string>) => {
      state.id = action.payload
      state.isOpenEndDialog = true
    },
    closeEndClassDialog: state => {
      state.id = null
      state.isOpenEndDialog = false
    }
  },
})

export const { closeAssignStudentsDialog, openAssignStudentsDialog ,openEndClassDialog,closeEndClassDialog} = classDialogs.actions

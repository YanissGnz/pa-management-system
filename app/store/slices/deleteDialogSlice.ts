"use client"

/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Define a type for the slice state
interface DeleteDialog {
  id: string | null
  isOpen: boolean
}

// Define the initial state using that type
const initialState: DeleteDialog = {
  id: null,
  isOpen: false,
}

export const deleteDialogSlice = createSlice({
  name: "deleteDialog",
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<string>) => {
      state.id = action.payload
      state.isOpen = true
    },
    closeDialog: state => {
      state.id = null
      state.isOpen = false
    },
  },
})

export const { openDialog, closeDialog } = deleteDialogSlice.actions

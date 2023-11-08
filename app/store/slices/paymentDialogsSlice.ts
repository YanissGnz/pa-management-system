"use client"

/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { TPaymentSchema } from "@/types/Payment"

// Define a type for the slice state
interface PrintDialog {
  payment: TPaymentSchema | null
  isOpen: boolean
  isPartialPaymentOpen: boolean
}

// Define the initial state using that type
const initialState: PrintDialog = {
  payment: null,
  isOpen: false,
  isPartialPaymentOpen: false,
}

export const printDialogSlice = createSlice({
  name: "printDialog",
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<TPaymentSchema>) => {
      state.payment = action.payload
      state.isOpen = true
    },
    closeDialog: state => {
      state.payment = null
      state.isOpen = false
    },
    openPartialPaymentDialog: (state, action: PayloadAction<TPaymentSchema>) => {
      state.payment = action.payload
      state.isPartialPaymentOpen = true
    },
    closePartialPaymentDialog: state => {
      state.payment = null
      state.isPartialPaymentOpen = false
    },
  },
})

export const { openDialog, closeDialog, closePartialPaymentDialog, openPartialPaymentDialog } =
  printDialogSlice.actions

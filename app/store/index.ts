"use client"

import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { printDialogSlice } from "./slices/paymentDialogsSlice"
import { deleteDialogSlice } from "./slices/deleteDialogSlice"
import { studentDetailsSlice } from "./slices/studentsDetailsSlice"
import { classDialogs } from "./slices/classDialogSlice"
import { studentDialogs } from "./slices/studentsDialogsSlice"
import { attendanceSheetDialog } from "./slices/attendanceSheetDialog"

const rootReducer = combineReducers({
  printDialog: printDialogSlice.reducer,
  deleteDialog: deleteDialogSlice.reducer,
  studentDialogs: studentDialogs.reducer,
  classDialogs: classDialogs.reducer,
  studentDetails: studentDetailsSlice.reducer,
  attendanceSheetDialog: attendanceSheetDialog.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

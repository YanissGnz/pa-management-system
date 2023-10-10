"use client"

import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { printDialogSlice } from "./slices/printDialogSlice"
import { deleteDialogSlice } from "./slices/deleteDialogSlice"
import { assignToClassDialog } from "./slices/assignToClassDialog"
import { assignStudentsDialog } from "./slices/assignStudentsDialog"
import { studentDetailsSlice } from "./slices/studentsDetailsSlice"

const rootReducer = combineReducers({
  printDialog: printDialogSlice.reducer,
  deleteDialog: deleteDialogSlice.reducer,
  assignToClassDialog: assignToClassDialog.reducer,
  assignStudentsDialog: assignStudentsDialog.reducer,
  studentDetails: studentDetailsSlice.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

"use client"

import React, { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { Button, buttonVariants } from "@/components/ui/button"
import { closeDialog } from "@/app/store/slices/deleteDialogSlice"
import { assignStudentToClass, deleteStudent } from "@/app/actions"
import { LoaderIcon } from "lucide-react"
import useSWR from "swr"
import { TClassSchema } from "@/types/Class"
import { capitalize } from "lodash"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TStudentSchema } from "@/types/Student"
import { closeAssignDialog } from "@/app/store/slices/assignToClassDialog"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { closeStudentDetails } from "@/app/store/slices/studentsDetailsSlice"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function StudentDialogs() {
  const dispatch = useAppDispatch()
  const { id, isOpen } = useAppSelector(state => state.deleteDialog)
  const { id: studentId, isOpen: isAssignOpen } = useAppSelector(state => state.assignToClassDialog)
  const { isOpen: isDetailsOpen, student: currentStudent } = useAppSelector(
    state => state.studentDetails
  )
  const [filteredClasses, setFilteredClasses] = useState<TClassSchema[]>([])
  const [selectedClassId, setSelectedClassId] = useState("")

  const { data: classes, isLoading: classesLoading } = useSWR<TClassSchema[], Error>(
    `${process.env.NEXT_BASE_URL}/api/classes`,
    fetcher
  )

  const { data: student, isLoading: studentLoading } = useSWR<TStudentSchema, Error>(
    `${process.env.NEXT_BASE_URL}/api/students/${studentId}`,
    fetcher
  )

  const handleDelete = async () => {
    if (!id) return
    dispatch(closeDialog())
    const promise = new Promise((resolve, reject) => {
      deleteStudent(id)
        .then(result => {
          if (result.success) {
            resolve("Student deleted successfully")
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Deleting student...",
      success: () => "Student deleted successfully",
      error: "Error deleting student",
    })
  }

  const handleAssignStudentToClass = async () => {
    if (!studentId) return
    dispatch(closeAssignDialog())
    const promise = new Promise((resolve, reject) => {
      assignStudentToClass(studentId, selectedClassId)
        .then(result => {
          if (result.success) {
            resolve("Student assigned successfully")
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Assigning student...",
      success: () => "Student assigned successfully",
      error: "Error assigning student",
    })
  }

  useEffect(() => {
    if (student) {
      setSelectedClassId(student.classes && student.classes[0]?.id ? student.classes[0].id : "")
    }
  }, [student, studentLoading])

  useEffect(() => {
    if (classes) {
      setFilteredClasses(classes)
    }
  }, [classes, classesLoading])

  return (
    <>
      <AlertDialog
        open={isOpen}
        onOpenChange={open => {
          if (!open) dispatch(closeDialog())
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm action</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this student?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Button variant={"ghost"}>Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDelete}
              asChild
            >
              <Button variant={"destructive"}>Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isAssignOpen}
        onOpenChange={open => {
          if (!open) dispatch(closeAssignDialog())
        }}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='mb-2'>Assign student to a class</DialogTitle>
            {classesLoading || studentLoading ? (
              <div className='flex items-center justify-center'>
                <LoaderIcon className='animate-spin' />
              </div>
            ) : classes && student ? (
              // student.paymentStatus !== "not paid" ? (
              <div className='flex flex-col space-y-2'>
                <Input
                  placeholder='Search classes'
                  className='w-full'
                  onChange={e => {
                    const { value } = e.target
                    if (!value) {
                      setFilteredClasses(classes!)
                      return
                    }
                    const filtered = classes?.filter(
                      c =>
                        c.title.toLowerCase().includes(value) ||
                        c.program.name.toLowerCase().includes(value) ||
                        c.level.name.toLowerCase().includes(value) ||
                        c.day.toLowerCase().includes(value) ||
                        c.startTime.toLowerCase().includes(value) ||
                        c.endTime.toLowerCase().includes(value)
                    )
                    setFilteredClasses(filtered!)
                  }}
                />
                <div className='grid grid-cols-12 gap-2 px-2 py-1'>
                  <p></p>
                  <p className='col-span-3 font-medium'>Title</p>
                  <p className='col-span-3 font-medium'>Program</p>
                  <p className='col-span-2 font-medium'>Level</p>
                  <p className='col-span-2 font-medium'>Time</p>
                </div>
                <ScrollArea className='h-96'>
                  <RadioGroup
                    onValueChange={value => setSelectedClassId(value)}
                    defaultValue={
                      student.classes && student.classes[0]?.id
                        ? student.expectedClasses
                          ? student.expectedClasses[0]
                          : ""
                        : ""
                    }
                    className='flex flex-col space-y-2'
                  >
                    {filteredClasses?.map(c => (
                      <div
                        key={c.id}
                        className='grid grid-cols-12 items-center gap-2 rounded border p-2'
                      >
                        {" "}
                        <RadioGroupItem
                          checked={selectedClassId === c.id}
                          value={c.id!}
                          id={c.id}
                          className='h-5 w-5'
                        />
                        <Label
                          htmlFor={c.id}
                          className='col-span-11 grid flex-1 grid-cols-11 items-center text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          <p className='col-span-3'>{c.title} </p>
                          <p className='col-span-3'>{c.program.name} </p>
                          <p className='col-span-2'>{c.level.name} </p>
                          <div className='col-span-2 space-y-1'>
                            <Badge variant='outline' className='text-sm'>
                              {capitalize(c.day)}
                            </Badge>
                            <div className='inline-flex items-center gap-1'>
                              <Badge variant='outline' className='text-sm'>
                                {c.startTime}
                              </Badge>{" "}
                              -
                              <Badge variant='outline' className='text-sm'>
                                {c.endTime}
                              </Badge>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollArea>
              </div>
            ) : (
              // TODO: uncomment this later
              // ) : (
              //   <div className='flex h-16 items-center justify-center'>
              //     <p className='font-medium text-red-500'>Student has not paid yet</p>
              //   </div>
              // )
              <div>No classes found</div>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='destructive'
              onClick={() => {
                dispatch(closeAssignDialog())
              }}
            >
              Cancel
            </Button>
            {/* {student?.paymentStatus !== "not paid" && ( */}
            <Button onClick={handleAssignStudentToClass}>Assign</Button>
            {/* )} */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet
        open={isDetailsOpen}
        onOpenChange={open => {
          if (!open) dispatch(closeStudentDetails())
        }}
      >
        <SheetContent>
          <SheetHeader className='mb-5'>
            <SheetTitle>Student details</SheetTitle>
          </SheetHeader>
          {currentStudent && (
            <div className='space-y-2'>
              <p>
                <span className='font-semibold'>Full name:</span> {currentStudent.fullName}
              </p>{" "}
              <div>
                <p className='font-semibold'>Comments:</p>
                {currentStudent.note ? (
                  <p>{currentStudent.note}</p>
                ) : (
                  <p className='text-red-500'>No comments</p>
                )}
              </div>{" "}
              <p className='border-b font-semibold'>Class:</p>
              {currentStudent.classes && currentStudent.classes.length > 0 ? (
                <div className='space-y-1'>
                  <p>
                    <span className='font-semibold'>Title:</span> {currentStudent.classes[0].title}
                  </p>
                  <p>
                    <span className='font-semibold'>Program:</span>{" "}
                    {currentStudent.classes[0].program.name}
                  </p>
                  <p>
                    <span className='font-semibold'>Level:</span>{" "}
                    {currentStudent.classes[0].level.name}
                  </p>
                  <p>
                    <span className='font-semibold'>Time:</span>{" "}
                    <div className='inline-flex items-center gap-1'>
                      <Badge variant='outline' className='text-sm'>
                        {currentStudent.classes[0].day}
                      </Badge>{" "}
                      -
                      <Badge variant='outline' className='text-sm'>
                        {currentStudent.classes[0].startTime} - {currentStudent.classes[0].endTime}
                      </Badge>
                    </div>
                  </p>
                  <p>
                    <span className='font-semibold'>Start date:</span>{" "}
                    {format(new Date(currentStudent.classes[0].startDate), "PPP")}
                  </p>
                  <p>
                    <span className='font-semibold'>End date:</span>{" "}
                    {format(new Date(currentStudent.classes[0].endDate), "PPP")}
                  </p>
                  <p>
                    <span className='font-semibold'>Week:</span>{" "}
                    {/* calculate the week number based on start date */}
                    {Math.ceil(
                      (new Date().getTime() -
                        new Date(currentStudent.classes[0].startDate).getTime()) /
                        (1000 * 3600 * 24 * 7)
                    )}
                  </p>{" "}
                  <p>
                    <span className='font-semibold'>Teacher:</span>{" "}
                    {currentStudent.classes[0].teacher.firstName}{" "}
                    {currentStudent.classes[0].teacher.lastName}
                  </p>
                  <p>
                    <span className='font-semibold'>Students count:</span>{" "}
                    {currentStudent.classes[0].students.length} / 15
                  </p>
                </div>
              ) : (
                <p className='text-red-500'>Not assigned to any class</p>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

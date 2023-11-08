"use client"

import React, { useEffect, useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { closeAssignStudentsDialog, closeEndClassDialog } from "@/app/store/slices/classDialogSlice"
import useSWR from "swr"
import { TStudentSchema } from "@/types/Student"
import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowLeftIcon, LoaderIcon } from "lucide-react"
import { toast } from "sonner"
import { capitalize } from "lodash"
import {
  assignStudentsToClass,
  deleteClass,
  endClass,
  updateSessionAttendance,
} from "@/app/actions"
import { Checkbox } from "@/components/ui/checkbox"
import { closeDialog as closeDeleteDialog } from "@/app/store/slices/deleteDialogSlice"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TClassSchema } from "@/types/Class"
import { Label } from "@/components/ui/label"
import { closeAttendanceSheetDialog } from "@/app/store/slices/attendanceSheetDialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TSession } from "@/types/Session"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ClassDialogs() {
  const { id: classIdToDelete, isOpen } = useAppSelector(state => state.deleteDialog)

  const {
    isOpen: isAssignStudentsOpen,
    id,
    isOpenEndDialog,
  } = useAppSelector(state => state.classDialogs)

  const { id: classSheetId, isOpen: isOpenAttendance } = useAppSelector(
    state => state.attendanceSheetDialog
  )

  const [attendanceOpen, setAttendanceOpen] = useState(false)

  useEffect(() => {
    if (!classSheetId) return
    setAttendanceOpen(isOpenAttendance)
  }, [classSheetId, isOpenAttendance])

  const classId = useMemo(() => {
    if (isOpen) return classIdToDelete
    if (isAssignStudentsOpen) return id
    if (isOpenAttendance) return classSheetId
    return ""
  }, [classIdToDelete, classSheetId, id, isAssignStudentsOpen, isOpen, isOpenAttendance])

  const { data: Class, isLoading: classLoading } = useSWR<TClassSchema, Error>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes/${classId}`,
    fetcher
  )

  const {
    data: sessions,
    isLoading: sessionLoading,
    mutate,
  } = useSWR<TSession[], Error>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes/${classId}/sessions`,
    fetcher
  )

  const { data: students, isLoading: studentsLoading } = useSWR<TStudentSchema[], Error>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/students`,
    fetcher
  )
  const dispatch = useAppDispatch()

  const [optimisticSessions, setOptimisticSessions] = useState<TSession[]>([])

  const [selectedStudentsIds, setSelectedStudentsIds] = useState<string[]>([])

  const [filteredStudents, setFilteredStudents] = useState<TStudentSchema[]>([])

  const handleAssignStudentsToClass = async () => {
    if (!id) return
    dispatch(closeDeleteDialog())
    const promise = new Promise((resolve, reject) => {
      assignStudentsToClass(id, selectedStudentsIds)
        .then(result => {
          if (result.success) {
            resolve("Students assigned successfully")
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Assigning students...",
      success: () => "Students assigned successfully",
      error: "Error assigning students",
    })
  }

  const handleDeleteClass = async () => {
    if (!classIdToDelete) return
    dispatch(closeDeleteDialog())

    const promise = new Promise((resolve, reject) => {
      deleteClass(classIdToDelete)
        .then(result => {
          if (result.success) {
            resolve("Class deleted successfully")
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Deleting class...",
      success: () => "Class deleted successfully",
      error: "Error assigning students",
    })
  }

  const handleEndClass = async () => {
    if (!id) return
    dispatch(closeDeleteDialog())

    const promise = new Promise((resolve, reject) => {
      endClass(id)
        .then(result => {
          if (result.success) {
            resolve("Class ended successfully")
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Ending class...",
      success: () => "Class ended successfully",
      error: "Error ending class",
    })
  }

  const handleUpdateSessionAttendance = async (sessionId: string, studentsIds: string[]) => {
    if (!sessionId) return
    dispatch(closeDeleteDialog())

    const promise = new Promise((resolve, reject) => {
      updateSessionAttendance(sessionId, studentsIds)
        .then(result => {
          if (result.success) {
            resolve("Attendance updated successfully")
          } else {
            reject()
            mutate()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Updating attendance...",
      success: () => "Attendance updated successfully",
      error: "Error updating attendance",
    })
  }

  useEffect(() => {
    if (!students) return
    setFilteredStudents(students)
  }, [students, studentsLoading])

  useEffect(() => {
    if (!Class || !Class.students) return
    const ids = Class.students.map(student => student.id!)
    setSelectedStudentsIds(ids)
  }, [Class, classLoading])

  useEffect(() => {
    if (!sessions) return
    setOptimisticSessions(sessions)
  }, [sessions, sessionLoading])

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={open => {
          if (!open) dispatch(closeDeleteDialog())
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure you want to delete this class?</DialogDescription>
          <DialogFooter>
            <Button
              variant={"ghost"}
              onClick={() => {
                dispatch(closeDeleteDialog())
              }}
            >
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDeleteClass}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isOpenEndDialog}
        onOpenChange={open => {
          if (!open) dispatch(closeEndClassDialog())
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure you want to end this class?</DialogDescription>
          <DialogFooter>
            <Button
              variant={"ghost"}
              onClick={() => {
                dispatch(closeEndClassDialog())
              }}
            >
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleEndClass}
            >
              End class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isAssignStudentsOpen}
        onOpenChange={open => {
          if (!open) dispatch(closeAssignStudentsDialog())
        }}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='mb-2'>Assign students to this class</DialogTitle>
            <div>
              {studentsLoading || classLoading ? (
                <div className='flex items-center justify-center'>
                  <LoaderIcon className='animate-spin' />
                </div>
              ) : (
                <div className='flex flex-col space-y-2'>
                  <Input
                    placeholder='Search students'
                    className='w-full'
                    onChange={e => {
                      const { value } = e.target
                      if (!value) {
                        setFilteredStudents(students!)
                        return
                      }
                      const filtered = students?.filter(student =>
                        student.fullName.toLowerCase().includes(value.toLowerCase())
                      )
                      setFilteredStudents(filtered!)
                    }}
                  />
                  <div className='grid grid-cols-12 gap-2 py-1'>
                    <p className='col-span-4 font-medium'>Name</p>
                    <p className='font-medium'>Age</p>
                    <p className='font-medium'>Level</p>
                    <p className='col-span-2 font-medium'>School type</p>
                    <p className='col-span-3 font-medium'>Payment status</p>
                  </div>
                  <ScrollArea className='h-96'>
                    <div className='flex flex-col space-y-2'>
                      {filteredStudents?.map(student => (
                        <div
                          key={student.id}
                          className='grid grid-cols-12 items-center gap-2 rounded border p-2'
                        >
                          <Checkbox
                            checked={selectedStudentsIds.includes(student.id)}
                            id={student.id}
                            onCheckedChange={checked => {
                              if (checked) {
                                if (selectedStudentsIds.length >= 20) {
                                  toast.error("You can't assign more than 20 students in a class")
                                  return
                                }
                                setSelectedStudentsIds(prev => [...prev, student.id])
                              } else {
                                setSelectedStudentsIds(prev => prev.filter(i => i !== student.id))
                              }
                            }}
                          />
                          <Label
                            htmlFor={student.id}
                            className='col-span-11 grid flex-1 grid-cols-11 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            <p className='col-span-4'>{student.fullName} </p>
                            <p className=''>{student.age} </p>
                            <p className=''>{student.level === "unknown" ? "/" : student.level} </p>
                            <p className='col-span-2'>{capitalize(student.schoolType)} </p>
                            <p className='col-span-3'>
                              {student.paymentStatus === "completed" && (
                                <Badge variant='success' className='capitalize'>
                                  Completed
                                </Badge>
                              )}
                              {student.paymentStatus === "incomplete" && (
                                <Badge variant='default' className='capitalize'>
                                  Incomplete
                                </Badge>
                              )}
                              {student.paymentStatus === "not paid" && (
                                <Badge variant='destructive' className='capitalize'>
                                  Not Paid
                                </Badge>
                              )}
                            </p>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='destructive'
              onClick={() => {
                dispatch(closeAssignStudentsDialog())
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignStudentsToClass}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Sheet
        open={attendanceOpen}
        onOpenChange={open => {
          if (!open) {
            setAttendanceOpen(false)
            setTimeout(() => {
              dispatch(closeAttendanceSheetDialog())
            }, 300)
          }
        }}
      >
        <SheetContent side='bottom' className='flex h-screen flex-col p-0'>
          <SheetHeader className='px-2 pt-2'>
            <SheetTitle className='flex items-center'>
              <Button
                variant='outline'
                className='mr-2'
                onClick={() => {
                  setAttendanceOpen(false)
                  setTimeout(() => {
                    dispatch(closeAttendanceSheetDialog())
                  }, 300)
                }}
              >
                <ArrowLeftIcon className='mr-1 h-5 w-5' />
                Back
              </Button>
              Fill attendance sheet
            </SheetTitle>
          </SheetHeader>
          {studentsLoading || sessionLoading || classLoading ? (
            <div className='flex h-full items-center justify-center'>
              <LoaderIcon className='animate-spin' />
            </div>
          ) : (
            <>
              <div className='flex flex-1 flex-col space-y-2 overflow-x-hidden overflow-y-scroll'>
                {Class?.students && Class.students.length > 0 ? (
                  <Table className='max-w-full whitespace-nowrap'>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='sticky left-0 z-10 border-r bg-background'>
                          Student
                        </TableHead>
                        {optimisticSessions
                          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                          ?.map(session => (
                            <TableHead key={session.id}>
                              {format(new Date(session.start), "MMM dd")}
                            </TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Class.students.map(student => (
                        <TableRow key={student.id}>
                          <TableCell className='sticky left-0 z-10 border-r bg-background font-medium'>
                            {student.fullName}
                          </TableCell>
                          {optimisticSessions?.map(session => (
                            <TableCell key={session.id}>
                              <div className='flex items-center justify-center'>
                                <Checkbox
                                  id={`${student.id}-${session.id}`}
                                  checked={session.attendance.includes(student.id)}
                                  onCheckedChange={checked => {
                                    if (checked) {
                                      const newAttendance = [...session.attendance, student.id]
                                      setOptimisticSessions(prev =>
                                        prev.map(s => {
                                          if (s.id === session.id) {
                                            return {
                                              ...s,
                                              attendance: newAttendance,
                                            }
                                          }
                                          return s
                                        })
                                      )
                                      handleUpdateSessionAttendance(session.id, newAttendance)
                                    } else {
                                      const newAttendance = session.attendance.filter(
                                        attendance => attendance !== student.id
                                      )
                                      setOptimisticSessions(prev =>
                                        prev.map(s => {
                                          if (s.id === session.id) {
                                            return {
                                              ...s,
                                              attendance: newAttendance,
                                            }
                                          }
                                          return s
                                        })
                                      )
                                      handleUpdateSessionAttendance(session.id, newAttendance)
                                    }
                                  }}
                                />
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <p className='text-lg text-red-500'>No students</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

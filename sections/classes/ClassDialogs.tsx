"use client"

import React, { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { closeAssignStudentsDialog } from "@/app/store/slices/assignStudentsDialog"
import useSWR from "swr"
import { TStudentSchema } from "@/types/Student"
import { Button, buttonVariants } from "@/components/ui/button"
import { LoaderIcon } from "lucide-react"
import { toast } from "sonner"
import { capitalize, isString } from "lodash"
import { assignStudentsToClass, deleteClass } from "@/app/actions"
import { Checkbox } from "@/components/ui/checkbox"
import { closeDialog } from "@/app/store/slices/deleteDialogSlice"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TClassSchema } from "@/types/Class"
import { Label } from "@/components/ui/label"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ClassDialogs() {
  const { id: classIdToDelete, isOpen } = useAppSelector(state => state.deleteDialog)

  const { isOpen: isAssignStudentsOpen, id } = useAppSelector(state => state.assignStudentsDialog)

  const { data: Class, isLoading: classLoading } = useSWR<TClassSchema, Error>(
    `${process.env.NEXT_BASE_URL}/api/classes/${id}`,
    fetcher
  )

  const { data: students, isLoading: studentsLoading } = useSWR<TStudentSchema[], Error>(
    `${process.env.NEXT_BASE_URL}/api/students`,
    fetcher
  )
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const [selectedStudentsIds, setSelectedStudentsIds] = useState<string[]>([])

  const [filteredStudents, setFilteredStudents] = useState<TStudentSchema[]>([])

  const handleAssignStudentsToClass = async () => {
    if (!id) return
    setIsLoading(true)
    const result = await assignStudentsToClass(id, selectedStudentsIds)
    if (result.errors) {
      const { errors } = result
      if (isString(errors)) {
        toast.error(errors)
      }
    } else {
      toast.success("Students assigned successfully")
    }
    dispatch(closeAssignStudentsDialog())
    setIsLoading(false)
  }

  const handleDeleteClass = async () => {
    if (!classIdToDelete) return
    dispatch(closeDialog())

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
      loading: "Assigning students...",
      success: () => "Class deleted successfully",
      error: "Error assigning students",
    })
  }

  useEffect(() => {
    if (!students) return
    setFilteredStudents(students)
  }, [students, isLoading])

  useEffect(() => {
    if (!Class) return
    const ids = Class.students.map(student => student.id!)
    setSelectedStudentsIds(ids)
  }, [Class, classLoading])

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
              onClick={handleDeleteClass}
              disabled={isLoading}
              asChild
            >
              <Button variant={"destructive"} disabled={isLoading}>
                {isLoading && <LoaderIcon className='h-4 w-4 animate-spin' />}
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
                    <p></p>
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
                                if (selectedStudentsIds.length >= 15) {
                                  toast.error("You can't assign more than 15 students at once")
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
            <Button onClick={handleAssignStudentsToClass} disabled={isLoading}>
              {isLoading && <LoaderIcon className='h-4 w-4 animate-spin' />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

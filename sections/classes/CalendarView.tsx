"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { TSession } from "@/types/Session"
import { EventSourceInput } from "@fullcalendar/core/index.js"
import { EventImpl } from "@fullcalendar/core/internal"
import { format } from "date-fns"
import { TStudentSchema } from "@/types/Student"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoaderIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { assignMultipleStudentsToSession, updateSessionAttendance } from "@/app/actions"
import { Badge } from "@/components/ui/badge"
import { capitalize } from "lodash"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CalendarView({ sessions }: { sessions: TSession[] }) {
  const events: EventSourceInput = useMemo(
    () =>
      sessions.map(session => ({
        id: session.id,
        title: session.title,
        start: session.start,
        end: session.end,
        extendedProps: {
          description: session.description,
          students: session.students,
          teacher: session.teacher,
          attendance: session.attendance,
        },
        color: session.color || "",
      })),
    [sessions]
  )

  const { data: students, isLoading } = useSWR<TStudentSchema[], Error>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/students`,
    fetcher
  )

  const [selectedEvent, setSelectedEvent] = useState<EventImpl | null>(null)
  const [openDetails, setOpenDetails] = useState(false)
  const [openAssign, setOpenAssign] = useState(false)
  const [openAttendance, setOpenAttendance] = useState(false)
  const [selectedStudentsIds, setSelectedStudentsIds] = useState<string[]>([])
  const [filteredStudents, setFilteredStudents] = useState<TStudentSchema[]>([])

  const handleAssignStudents = async () => {
    if (!selectedEvent) return

    const promise = new Promise((resolve, reject) => {
      assignMultipleStudentsToSession(selectedStudentsIds, selectedEvent?.id)
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
      success: () => {
        setOpenAssign(false)
        setSelectedStudentsIds([])
        return "Students assigned successfully"
      },
      error: "Error assigning students",
    })
  }

  const handleUpdateAttendanceSheet = async () => {
    if (!selectedEvent) return

    const promise = new Promise((resolve, reject) => {
      updateSessionAttendance(selectedEvent?.id, selectedStudentsIds)
        .then(result => {
          if (result.success) {
            resolve("Attendance updated successfully")
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
    toast.promise(promise, {
      loading: "Updating attendance...",
      success: () => {
        setOpenAssign(false)
        setOpenAttendance(false)
        setSelectedStudentsIds([])
        return "Attendance updated successfully"
      },
      error: "Error updating attendance",
    })
  }

  useEffect(() => {
    if (!students) return
    setFilteredStudents(students)
  }, [students, isLoading])

  return (
    <div>
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView='timeGridWeek'
        events={events}
        slotMinTime='08:00:00'
        slotMaxTime='21:00:00'
        allDaySlot={false}
        height='auto'
        eventClick={info => {
          info.jsEvent.preventDefault()
          setSelectedEvent(info.event)
          setOpenDetails(true)
        }}
      />
      <Sheet
        open={openDetails}
        onOpenChange={open => {
          if (!open) {
            setOpenDetails(false)
            setTimeout(() => {
              setSelectedEvent(null)
            }, 300)
          }
        }}
      >
        <SheetContent className='flex h-screen flex-col '>
          <SheetHeader>
            <SheetTitle>Session Details</SheetTitle>
          </SheetHeader>
          {selectedEvent && (
            <div className=' flex h-full flex-1 flex-col space-y-2'>
              <p>
                <span className='font-semibold'>Title:</span> {selectedEvent?.title}
              </p>
              <p>
                <span className='font-semibold'>Date:</span>{" "}
                {format(new Date(selectedEvent?.startStr.toString()), "dd/MM/yyyy") || "Not valid"}
              </p>
              <p>
                <span className='font-semibold'>Time:</span>{" "}
                {format(new Date(selectedEvent?.startStr.toString()), "HH:mm a") || "Not valid"} -{" "}
                {format(new Date(selectedEvent?.endStr.toString()), "HH:mm a") || "Not valid"}
              </p>
              <p>
                <span className='font-semibold'>Teacher:</span>{" "}
                {selectedEvent?.extendedProps.teacher?.firstName}{" "}
                {selectedEvent?.extendedProps.teacher?.lastName}
              </p>
              <p>
                <span className='font-semibold'>Description:</span>{" "}
                {selectedEvent?.extendedProps.description || "No description"}
              </p>
              <p>
                <span className='font-semibold'>Students:</span>{" "}
              </p>
              <ScrollArea className='max-h-52 flex-1'>
                {selectedEvent?.extendedProps.students.length > 0 ? (
                  selectedEvent?.extendedProps.students?.map((student: Partial<TStudentSchema>) => (
                    <p key={student.id} className='mb-1'>
                      {student.fullName}
                    </p>
                  ))
                ) : (
                  <p>No students</p>
                )}
              </ScrollArea>
            </div>
          )}
          <SheetFooter className='mt-5'>
            <div className='flex-1 space-y-2'>
              <Button className='w-full' onClick={() => setOpenAssign(true)}>
                Assign Students
              </Button>
              <Button
                className='w-full'
                onClick={() => {
                  setOpenAttendance(true)
                  setSelectedStudentsIds(selectedEvent?.extendedProps.attendance || [])
                }}
              >
                Fill attendance sheet
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Dialog
        open={openAssign}
        onOpenChange={open => {
          if (!open) setOpenAssign(false)
        }}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='mb-2'>Assign students to this class</DialogTitle>
            <div>
              {isLoading ? (
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
                          <label
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
                          </label>
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
                setOpenAssign(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignStudents} disabled={isLoading}>
              {isLoading && <LoaderIcon className='h-4 w-4 animate-spin' />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(selectedEvent) && openAttendance}
        onOpenChange={open => {
          if (!open) {
            setOpenAttendance(false)
          }
        }}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Fill attendance sheet</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col space-y-2'>
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
                {selectedEvent?.extendedProps.students.length > 0 ? (
                  selectedEvent?.extendedProps.students?.map((student: TStudentSchema) => (
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
                      <label
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
                      </label>
                    </div>
                  ))
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <p className='text-lg text-red-500'>No students</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className='inline-flex justify-end gap-2'>
            <Button onClick={handleUpdateAttendanceSheet}>Update Attendance</Button>
            <Button variant='secondary' onClick={() => setOpenAttendance(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

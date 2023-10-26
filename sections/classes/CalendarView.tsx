"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
// utils
import { format } from "date-fns"
import { capitalize } from "lodash"
import { assignMultipleStudentsToSession, updateSessionAttendance } from "@/app/actions"
// types
import { TSession } from "@/types/Session"
import { TStudentSchema } from "@/types/Student"
// calender
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import dayGridPlugin from "@fullcalendar/daygrid"
import listPlugin from "@fullcalendar/list"
import { EventSourceInput } from "@fullcalendar/core/index.js"
import { EventImpl } from "@fullcalendar/core/internal"
// icons
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GalleryHorizontalIcon,
  GalleryVerticalIcon,
  ListIcon,
  LoaderIcon,
} from "lucide-react"
// components
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  const calenderRef = useRef<FullCalendar>(null)

  const [selectedEvent, setSelectedEvent] = useState<EventImpl | null>(null)
  const [openDetails, setOpenDetails] = useState(false)
  const [openAssign, setOpenAssign] = useState(false)
  const [openAttendance, setOpenAttendance] = useState(false)
  const [selectedStudentsIds, setSelectedStudentsIds] = useState<string[]>([])
  const [filteredStudents, setFilteredStudents] = useState<TStudentSchema[]>([])
  const [currentView, setCurrentView] = useState("timeGridWeek")

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
      <TooltipProvider>
        <div className='mb-5 flex w-full items-center justify-between'>
          <div className='divide-x rounded border'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  aria-label='Toggle month'
                  data-state={currentView === "dayGridMonth" ? "on" : "off"}
                  onPressedChange={() => {
                    if (calenderRef.current) {
                      calenderRef.current.getApi().changeView("dayGridMonth")
                      setCurrentView("dayGridMonth")
                    }
                  }}
                  pressed={currentView === "dayGridMonth"}
                >
                  <CalendarDaysIcon className='h-4 w-4' />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Month view</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  aria-label='Toggle week'
                  data-state={currentView === "timeGridWeek" ? "on" : "off"}
                  onPressedChange={() => {
                    if (calenderRef.current) {
                      calenderRef.current.getApi().changeView("timeGridWeek")
                      setCurrentView("timeGridWeek")
                    }
                  }}
                  pressed={currentView === "timeGridWeek"}
                >
                  <GalleryHorizontalIcon className='h-4 w-4' />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Week view</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  aria-label='Toggle list'
                  data-state={currentView === "listWeek" ? "on" : "off"}
                  onPressedChange={() => {
                    if (calenderRef.current) {
                      calenderRef.current.getApi().changeView("listWeek")
                      setCurrentView("listWeek")
                    }
                  }}
                  pressed={currentView === "listWeek"}
                >
                  <ListIcon className='h-4 w-4' />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>List view</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  aria-label='Toggle day'
                  data-state={currentView === "timeGridDay" ? "on" : "off"}
                  onPressedChange={() => {
                    if (calenderRef.current) {
                      calenderRef.current.getApi().changeView("timeGridDay")
                      setCurrentView("timeGridDay")
                    }
                  }}
                  pressed={currentView === "timeGridDay"}
                >
                  <GalleryVerticalIcon className='h-4 w-4' />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Day view</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <h2>
            {calenderRef.current?.getApi().view.type === "timeGridWeek" && (
              <span className='ml-2 text-gray-500'>
                {format(new Date(calenderRef.current?.getApi().view.currentStart), "dd/MM/yyyy")} -{" "}
                {format(new Date(calenderRef.current?.getApi().view.currentEnd), "dd/MM/yyyy")}
              </span>
            )}
            {calenderRef.current?.getApi().view.type === "dayGridMonth" && (
              <span className='ml-2 text-gray-500'>
                {format(new Date(calenderRef.current?.getApi().view.currentStart), "MMMM yyyy")}
              </span>
            )}
            {calenderRef.current?.getApi().view.type === "listWeek" && (
              <span className='ml-2 text-gray-500'>
                {format(new Date(calenderRef.current?.getApi().view.currentStart), "MMMM yyyy")}
              </span>
            )}
            {calenderRef.current?.getApi().view.type === "timeGridDay" && (
              <span className='ml-2 text-gray-500'>
                {format(new Date(calenderRef.current?.getApi().view.currentStart), "dd/MM/yyyy")}
              </span>
            )}
          </h2>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              onClick={() => {
                if (calenderRef.current) {
                  calenderRef.current.getApi().today()
                }
              }}
            >
              Today
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    if (calenderRef.current) {
                      calenderRef.current.getApi().prev()
                    }
                  }}
                >
                  <ChevronLeftIcon className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    if (calenderRef.current) {
                      calenderRef.current.getApi().next()
                    }
                  }}
                >
                  <ChevronRightIcon className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
      <FullCalendar
        ref={calenderRef}
        headerToolbar={false}
        plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
        views={{
          timeGridWeek: {
            titleFormat: { year: "numeric", month: "long", day: "numeric" },
          },
        }}
        initialView='listWeek'
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
                                if (selectedStudentsIds.length >= 20) {
                                  toast.error("You can't assign more than 20 students at once")
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
                            if (selectedStudentsIds.length >= 20) {
                              toast.error("You can't assign more than 20 students at once")
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

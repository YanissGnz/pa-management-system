"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { isString } from "lodash"
import useSWR from "swr"
// form
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// types
import { TPaymentSchema, paymentSchema } from "@/types/Payment"
import { TStudentSchema } from "@/types/Student"
// actions
import { addPayment, assignStudentToClass } from "@/app/actions"
// components
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon, Loader, Loader2 } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"
import { addMonths, format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TClassSchema } from "@/types/Class"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AddPaymentForm() {
  // get student id from url if available

  const searchParams = useSearchParams()

  const studentId = searchParams.get("studentId")

  const { data, isLoading } = useSWR<TStudentSchema[], Error>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/students`,
    fetcher
  )

  const { data: classes, isLoading: classesLoading } = useSWR<TClassSchema[], Error>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes`,
    fetcher
  )

  const { push } = useRouter()

  const [selectedStudent, setSelectedStudent] = useState<{
    label: string
    value: string
    hasFamilyPlan: boolean
    partner: string | null
    kids: string[]
    isAssigned: boolean
    expectedClasses: string[] | undefined | null
  }>({
    expectedClasses: [],
    hasFamilyPlan: false,
    isAssigned: true,
    kids: [],
    label: "",
    partner: null,
    value: "",
  })

  const [openFamilyDialog, setOpenFamilyDialog] = useState(false)
  const [openAssignClass, setOpenAssignClass] = useState(false)

  const [selectedClassesId, setSelectedClassesId] = useState<string>("")

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  const studentsList = useMemo(() => {
    if (isLoading) return []
    if (!data) return []
    return data.map(student => ({
      label: `${student.fullName}`,
      value: student.id!,
      hasFamilyPlan:
        student.type === "family" &&
        ((student?.Kids && student?.Kids?.length > 0) || student.Partner !== null),
      partner: student?.Partner?.id ?? null,
      kids: student?.Kids?.map(kid => kid.id!) ?? [],
      isAssigned: Boolean(
        student.classes !== null && student.classes && student.classes?.length > 0
      ),
      expectedClasses: student.expectedClasses,
    }))
  }, [data, isLoading])

  const form = useForm<TPaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      date: new Date(),
      code: "",
      note: "",
      studentId: "",
      status: "",
      due: new Date(
        new Date().getDate() < 15 ? new Date().setDate(15) : addMonths(new Date().setDate(15), 1)
      ),
    },
  })

  async function onSubmit(values: TPaymentSchema) {
    const result = await addPayment(values)
    if (result.errors) {
      const { errors } = result
      if (isString(errors)) {
        toast.error(errors)
      } else {
        if (errors.amount) {
          form.setError("amount", { message: errors.amount })
        }
        if (errors.date) {
          form.setError("date", { message: errors.date })
        }
        if (errors.code) {
          form.setError("code", { message: errors.code })
        }
        if (errors.discount) {
          form.setError("discount", { message: errors.discount })
        }
        if (errors.note) {
          form.setError("note", { message: errors.note })
        }
        if (errors.payedAmount) {
          form.setError("payedAmount", { message: errors.payedAmount })
        }
        if (errors.studentId) {
          form.setError("studentId", { message: errors.studentId })
        }
        if (errors.from) {
          toast.error("Invalid start date")
        }
        if (errors.to) {
          toast.error("Invalid end date")
        }
        if (errors.status) {
          form.setError("status", { message: errors.status })
        }
      }
    } else {
      toast.success("Payment added successfully")
      form.reset()
      if (selectedStudent.isAssigned) push("/dashboard/accounting")
      else setOpenAssignClass(true)
    }
  }

  const handleAddFamilyMembers = () => {
    setOpenFamilyDialog(false)
    const partnerId = studentsList.find(student => student.hasFamilyPlan)?.partner
    const kidsIds = studentsList.find(student => student.hasFamilyPlan)?.kids
    if (partnerId) form.setValue("partnerId", partnerId)
    if (kidsIds) form.setValue("kidsIds", kidsIds)
  }

  const handleAssignStudentToClass = async () => {
    const result = await assignStudentToClass(selectedStudent.value, selectedClassesId)
    if (result.errors) {
      const { errors } = result
      if (isString(errors)) {
        toast.error(errors)
      }
    } else {
      toast.success("Student assigned successfully")
      push("/dashboard/accounting")
    }
  }

  useEffect(() => {
    if (studentId) {
      const student = studentsList.find(s => s.value === studentId)
      if (student) {
        setSelectedStudent(student)
        form.setValue("studentId", student.value)
      }
    }
  }, [studentId, studentsList, form])

  return (
    <ScrollArea className='h-full w-full !overflow-x-visible'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid w-full grid-cols-3 gap-5 px-2'>
          <FormField
            control={form.control}
            name='studentId'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-end gap-2'>
                <FormLabel>Student</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn("justify-between", !field.value && "text-muted-foreground")}
                      >
                        <div className='inline-flex gap-2'>
                          {isLoading && <Loader className='animate-spin' />}
                          {field.value
                            ? studentsList.find(student => student.value === field.value)?.label
                            : "Select student"}
                        </div>
                        <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-fit p-0'>
                    <Command>
                      <CommandInput placeholder='Search student...' />
                      <CommandEmpty>No student found.</CommandEmpty>
                      <CommandGroup>
                        {studentsList.map(student => (
                          <CommandItem
                            value={student.label}
                            key={student.value}
                            onSelect={() => {
                              setSelectedStudent(student)
                              form.setValue("studentId", student.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                student.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {student.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className='flex flex-col'>
            <FormLabel>Period</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Select period</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    initialFocus
                    mode='range'
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={value => {
                      setDate(value)
                      if (value?.from) form.setValue("from", value.from)
                      if (value?.to) form.setValue("to", value.to)
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name='due'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-end gap-2'>
                <FormLabel>Due date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={d => d < new Date() || d < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='discount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    value={field.value || ""}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='payedAmount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payed Amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    value={field.value || ""}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='note'
            render={({ field }) => (
              <FormItem className='col-span-3'>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea className='resize-none' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='col-span-3 flex items-center justify-end gap-5'>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader className='animate-spin' />}
              Submit
            </Button>
            <Button type='reset' variant='secondary'>
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
      <Dialog open={openFamilyDialog} onOpenChange={open => setOpenFamilyDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Family plan</DialogTitle>
            <DialogDescription>
              The selected student has a family plan, do you want to add the other students to the
              payment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='destructive' onClick={() => setOpenFamilyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFamilyMembers}>Yes, Include</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openAssignClass} onOpenChange={open => setOpenAssignClass(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign student to a class</DialogTitle>
            {classesLoading ? (
              <div className='flex items-center justify-center'>
                <Loader2 className='animate-spin' />
              </div>
            ) : (
              <RadioGroup
                onValueChange={value => setSelectedClassesId(value)}
                defaultValue={
                  selectedStudent.expectedClasses ? selectedStudent.expectedClasses[0] : ""
                }
              >
                {classes?.map(c => (
                  <div key={c.id} className='flex items-center space-x-2'>
                    <RadioGroupItem value={c.id!} id={c.id} />
                    <Label htmlFor={c.id}>
                      {/* add the index of this class in the expected classes */}
                      {selectedStudent?.expectedClasses?.includes(c.id!) &&
                        `Expected N°: ${
                          selectedStudent.expectedClasses.findIndex(ec => ec === c.id) + 1
                        }. `}
                      {c.title} - {c.program?.name} {c.level?.name} - {c.day} {c.startTime} to{" "}
                      {c.endTime}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='destructive'
              onClick={() => {
                push("/dashboard/accounting")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignStudentToClass}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}

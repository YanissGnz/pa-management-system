"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { isString } from "lodash"
import useSWR from "swr"
// form
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// types
// actions
import { addClass, updateClass } from "@/app/actions"
// components
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon, Loader, Trash2Icon } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { TClassSchema, TClassDay, classSchema, classDaysSchema } from "@/types/Class"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TTeacherSchema } from "@/types/Teacher"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { TProgramSchema } from "@/types/Program"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"

const DAYS = [
  <SelectItem key='saturday' value='saturday'>
    Saturday
  </SelectItem>,
  <SelectItem key='sunday' value='sunday'>
    Sunday
  </SelectItem>,
  <SelectItem key='monday' value='monday'>
    Monday
  </SelectItem>,
  <SelectItem key='tuesday' value='tuesday'>
    Tuesday
  </SelectItem>,
  <SelectItem key='wednesday' value='wednesday'>
    Wednesday
  </SelectItem>,
  <SelectItem key='thursday' value='thursday'>
    Thursday
  </SelectItem>,
  <SelectItem key='friday' value='friday'>
    Friday
  </SelectItem>,
]

const fetcher = (url: string) => fetch(url).then(res => res.json())

const dayInitialState = { day: "", startTime: "", endTime: "", color: "" }

export default function AddEditClassForm({
  isEdit = false,
  currentClass,
}: {
  isEdit?: boolean
  currentClass?: TClassSchema
}) {
  const [days, setDays] = useState<TClassDay[]>([])
  const [day, setDay] = useState<TClassDay>(dayInitialState)
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)

  const { data, isLoading } = useSWR<TTeacherSchema[], Error>(
    `${process.env.NEXT_BASE_URL}/api/teachers`,
    fetcher
  )

  const { data: programs, isLoading: isProgramsLoading } = useSWR<TProgramSchema[], Error>(
    `${process.env.NEXT_BASE_URL}/api/programs`,
    fetcher
  )

  const defaultValues = useMemo(() => {
    if (isEdit && currentClass) {
      return {
        ...currentClass,
        startDate: new Date(currentClass.startDate),
        endDate: new Date(currentClass.endDate),
        classSessions: [],
      }
    }
    return { title: "", description: "", teacherId: "", programId: "", levelId: "" }
  }, [isEdit, currentClass])

  const teachersList = useMemo(() => {
    if (isLoading) return []
    if (!data) return []
    return data?.map(teacher => ({
      label: `${teacher.firstName} ${teacher.lastName}`,
      value: teacher.id!,
    }))
  }, [data, isLoading])

  const programsList = useMemo(() => {
    if (isProgramsLoading) return []
    if (!programs) return []

    return programs?.map(program => ({
      label: `${program.name}`,
      value: program.id!,
    }))
  }, [programs, isProgramsLoading])

  const levelsList = useMemo(() => {
    if (selectedProgramId === null) return []
    if (isProgramsLoading) return []
    if (!programs) return []

    const program = programs.find(p => p.id === selectedProgramId)

    if (!program) return []

    return program.levels.map(level => ({
      label: `${level.name}`,
      value: level.id!,
    }))
  }, [programs, isProgramsLoading, selectedProgramId])

  const { push } = useRouter()

  const form = useForm<TClassSchema>({
    resolver: zodResolver(isEdit ? classSchema.omit({ classSessions: true }) : classSchema),
    defaultValues,
  })

  async function onSubmit(values: TClassSchema) {
    const result = await (isEdit ? updateClass(values, currentClass!.id!) : addClass(values))
    if (result.errors) {
      const { errors } = result

      if (isString(errors)) {
        toast.error(errors)
      } else {
        if (errors.title) {
          form.setError("title", { message: errors.title })
        }
        if (errors.description) {
          form.setError("description", { message: errors.description })
        }
        if (errors.teacherId) {
          form.setError("teacherId", { message: errors.teacherId })
        }
        if (errors.programId) {
          form.setError("programId", { message: errors.programId })
        }
        if (errors.levelId) {
          form.setError("levelId", { message: errors.levelId })
        }
        if (errors.classSessions) {
          toast.error(errors.classSessions)
        }
      }
    } else {
      toast.success(isEdit ? "Class updated successfully" : "Class added successfully")

      push("/dashboard/classes")
      form.reset()
    }
  }

  const handleAddSession = () => {
    const newSession = classDaysSchema.safeParse(day)

    if (newSession.success) {
      setDays(prev => [...prev, newSession.data])
      form.setValue("classSessions", [...days, newSession.data])
      setDay(dayInitialState)
    } else toast.error(newSession.error.issues.map(issue => issue.message).join(", "))
  }

  useEffect(() => {
    if (isEdit && currentClass) {
      setSelectedProgramId(currentClass.programId)
    }
  }, [currentClass, isEdit, form])

  return (
    <ScrollArea className='h-full w-full !overflow-x-visible'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid w-full grid-cols-2 gap-5 px-2'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='teacherId'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-end gap-2'>
                <FormLabel>Teacher</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn("justify-between", !field.value && "text-muted-foreground")}
                      >
                        {isLoading && <Loader className='animate-spin' />}
                        {field.value
                          ? teachersList.find(teacher => teacher.value === field.value)?.label
                          : "Select teacher"}
                        <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='p-0'>
                    <Command>
                      <CommandInput placeholder='Search teacher...' />
                      <CommandEmpty>No teacher found.</CommandEmpty>
                      <CommandGroup>
                        {teachersList.map(teacher => (
                          <CommandItem
                            value={teacher.label}
                            key={teacher.value}
                            onSelect={() => {
                              form.setValue("teacherId", teacher.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                teacher.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {teacher.label}
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
          <FormField
            control={form.control}
            name='programId'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-end gap-2'>
                <FormLabel>Program</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn("justify-between", !field.value && "text-muted-foreground")}
                      >
                        {isLoading && <Loader className='animate-spin' />}
                        {field.value
                          ? programsList.find(program => program.value === field.value)?.label
                          : "Select program"}
                        <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='p-0'>
                    <Command>
                      <CommandInput placeholder='Search program...' />
                      <CommandEmpty>No program found.</CommandEmpty>
                      <CommandGroup>
                        {programsList.map(program => (
                          <CommandItem
                            value={program.label}
                            key={program.value}
                            onSelect={() => {
                              setSelectedProgramId(program.value)
                              form.setValue("programId", program.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                program.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {program.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name='levelId'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-end gap-2'>
                <FormLabel>Level</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn("justify-between", !field.value && "text-muted-foreground")}
                      >
                        {isLoading && <Loader className='animate-spin' />}
                        {field.value
                          ? levelsList.find(level => level.value === field.value)?.label
                          : "Select level"}
                        <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='p-0'>
                    <Command>
                      <CommandInput placeholder='Search level...' />
                      <CommandEmpty>No level found.</CommandEmpty>
                      <CommandGroup>
                        {levelsList.map(level => (
                          <CommandItem
                            value={level.label}
                            key={level.value}
                            onSelect={() => {
                              form.setValue("levelId", level.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                level.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {level.label}
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
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Start date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " pl-3 text-left font-normal",
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>End date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " pl-3 text-left font-normal",
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
            name='description'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isEdit && (
            <>
              <div className='col-span-2 mb-2 grid grid-cols-4 gap-5 px-2'>
                <h1 className='col-span-4 border-b text-base font-bold'>Add classSessions</h1>
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select
                    value={day.day}
                    onValueChange={value => setDay(prev => ({ ...prev, day: value }))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{DAYS.map(d => d)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Start time</FormLabel>
                  <FormControl>
                    <Input
                      type='time'
                      value={day.startTime}
                      onChange={e => setDay(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>End time</FormLabel>
                  <FormControl>
                    <Input
                      type='time'
                      value={day.endTime}
                      onChange={e => setDay(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input
                      type='color'
                      value={day.color}
                      onChange={e => setDay(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </div>
              <div className='col-span-2 flex justify-end'>
                <Button type='button' variant='outline' onClick={handleAddSession}>
                  Add session
                </Button>
              </div>
              <div className='col-span-2'>
                <h1 className='border-b text-base font-bold'>Sessions</h1>
                <div className='mt-2 gap-5'>
                  {days.map((d, i) => (
                    <div key={i} className='flex items-start justify-between rounded-md border p-2'>
                      <div className='flex flex-1 flex-col gap-2'>
                        <span className='font-bold'>Day</span>
                        <span className='capitalize'>{d.day}</span>
                        <span className='font-bold'>Start time</span>
                        {d.startTime}
                        <span className='text-sm font-bold'>End time</span>
                        <span>{d.endTime}</span>
                      </div>
                      <Button
                        type='button'
                        variant={"destructive"}
                        onClick={() => {
                          setDays(prev => prev.filter((_, index) => index !== i))
                          form.setValue("classSessions", [...days])
                        }}
                      >
                        <Trash2Icon size={18} />
                      </Button>
                    </div>
                  ))}
                  {/* delete level */}
                </div>
              </div>
            </>
          )}
          <div className='col-span-2 flex justify-end'>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader className='animate-spin' />}
              {isEdit ? "Edit class" : "Add class"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </ScrollArea>
  )
}

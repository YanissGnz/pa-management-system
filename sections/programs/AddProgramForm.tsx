"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { isString } from "lodash"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
// form
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
// actions
import { addProgram } from "@/app/actions"
// components
import { CalendarIcon, Loader, Trash2Icon } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { TLevelSchema, TProgramSchema, programSchema } from "@/types/Program"
import { levelSchema } from "@/types/Level"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"

const levelInitialState: TLevelSchema = {
  name: "",
  description: "",
  duration: 0,
  price: 0,
}

export default function AddProgramForm() {
  const { push } = useRouter()

  const [level, setLevel] = useState<TLevelSchema>(levelInitialState)
  const [levels, setLevels] = useState<TLevelSchema[]>([])
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  })

  const form = useForm<TProgramSchema>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })
  async function onSubmit(values: TProgramSchema) {
    const result = await addProgram(values)
    if (result.errors) {
      const { errors } = result

      if (isString(errors)) {
        toast.error(errors)
      } else {
        if (errors.name) {
          form.setError("name", { message: errors.name })
        }
        if (errors.description) {
          form.setError("description", { message: errors.description })
        }
      }
    } else {
      toast.success("Program added successfully")
      push("/dashboard/programs")
      form.reset()
    }
  }

  const handleAddLevel = () => {
    const newLevel = levelSchema.safeParse(level)

    if (newLevel.success) {
      setLevels(prev => [...prev, newLevel.data])
      form.setValue("levels", [...levels, newLevel.data])
      setLevel(levelInitialState)
    } else toast.error(newLevel.error.issues.map(issue => issue.message).join(", "))
  }

  return (
    <ScrollArea className='h-full w-full !overflow-x-visible'>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='4 grid w-full grid-cols-2 gap-5 px-2'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='col-span-2 mb-2 grid grid-cols-3 gap-5 px-2'>
            <h1 className='col-span-4 border-b text-base font-bold'>Add levels</h1>
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  value={level?.name || ""}
                  onChange={e => setLevel({ ...level, name: e.target.value })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem className='flex flex-col'>
              <FormLabel>Duration</FormLabel>
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
                        <span>Select duration</span>
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
                        setLevel({
                          ...level,
                          duration:
                            ((value?.to?.getTime() ?? 0) - (value?.from?.getTime() ?? 0)) /
                              (1000 * 3600 * 24) +
                            1,
                        })
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  value={level?.price || ""}
                  onChange={e => setLevel({ ...level, price: Number(e.target.value) })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem className='col-span-3'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  value={level?.description || ""}
                  onChange={e => setLevel({ ...level, description: e.target.value })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <div className='col-span-2 flex justify-end'>
            <Button type='button' variant='outline' onClick={handleAddLevel}>
              Add level
            </Button>
          </div>
          <div className='col-span-2'>
            <h1 className='border-b text-base font-bold'>Levels</h1>
            <div className='mt-2 gap-5'>
              {levels.map((l, i) => (
                <div key={i} className='flex items-start justify-between rounded-md border p-2'>
                  <div className='flex flex-1 flex-col gap-2'>
                    <span className='font-bold'>{l.name}</span>
                    <span className='text-sm font-bold'>Duration</span>
                    {l.duration && <span>{`${l.duration / 31} months`}</span>}
                    <span className='text-sm font-bold'>Price</span>
                    <span>{l.price} Da</span>
                    <span className='text-sm font-bold'>Description</span>
                    <span>{l.description}</span>
                  </div>
                  <Button
                    type='button'
                    variant={"destructive"}
                    onClick={() => {
                      setLevels(prev => prev.filter((_, index) => index !== i))
                      form.setValue("levels", [...levels])
                    }}
                  >
                    <Trash2Icon size={18} />
                  </Button>
                </div>
              ))}
              {/* delete level */}
            </div>
          </div>
          <div className='col-span-2 flex items-center justify-end gap-2'>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader className='animate-spin' />}
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </ScrollArea>
  )
}
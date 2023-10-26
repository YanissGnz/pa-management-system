"use client"

import { useEffect, useMemo, useState } from "react"
import { capitalize, isString } from "lodash"
import { useRouter } from "next/navigation"
// form
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// types
import { TKidSchema, TStudentSchema, kidSchema, studentSchema } from "@/types/Student"
// actions
import { addStudent, updateStudent } from "@/app/actions"
// components
import { Loader, Trash2Icon } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import useSWR from "swr"
import { TClassSchema } from "@/types/Class"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

const LEVELS = [
  <SelectItem key='nursery' value='LN'>
    Nursery
  </SelectItem>,
  <SelectItem key='1' value='L1'>
    Level 1
  </SelectItem>,
  <SelectItem key='2' value='L2'>
    Level 2
  </SelectItem>,
  <SelectItem key='3' value='L3'>
    Level 3
  </SelectItem>,
]

const SCHOOL_TYPES = [
  <SelectItem key='preschool' value='preschool'>
    Preschool
  </SelectItem>,
  <SelectItem key='primary' value='primary'>
    Primary school
  </SelectItem>,
  <SelectItem key='middle' value='middle'>
    Middle school
  </SelectItem>,
]

const kidInitialValues: TKidSchema = {
  fullName: "",
  level: "LN",
  schoolType: "preschool",
  schoolYear: "",
  sex: "male",
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AddEditStudentForm({
  isEdit = false,
  student,
}: {
  isEdit?: boolean
  student?: TStudentSchema
}) {
  const { data, isLoading } = useSWR<TClassSchema[], Error>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes`,
    fetcher
  )

  const defaultValues = useMemo(() => {
    if (isEdit && student) {
      return {
        ...student,
        email: student.email && student.email?.length > 0 ? student.email : null,
        parentEmail:
          student.parentEmail && student.parentEmail?.length > 0 ? student.parentEmail : null,
        parentName:
          student.parentName && student.parentName?.length > 0 ? student.parentName : null,
        parentNumber:
          student.parentNumber && student.parentNumber?.length > 0 ? student.parentNumber : null,
        parentOccupation:
          student.parentOccupation && student.parentOccupation?.length > 0
            ? student.parentOccupation
            : null,
        registrationDate: new Date(student.registrationDate?.toLocaleString() || ""),
      }
    }
    return {
      FullName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      birthDate: "",
      Kids: [],
    }
  }, [isEdit, student])

  const { push } = useRouter()
  const [type, setType] = useState("")
  const [ageCategory, setAgeCategory] = useState("")
  const [hasPartner, setHasPartner] = useState(false)
  const [hasKids, setHasKids] = useState(false)
  const [expectedClasses, setExpectedClasses] = useState<string[]>([])

  const [kids, setKids] = useState<TKidSchema[]>([])

  const [kid, setKid] = useState<TKidSchema>(kidInitialValues)

  const form = useForm<TStudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  })

  useEffect(() => {
    if (isEdit && student) {
      setType(student.type)
      setAgeCategory(student.ageCategory || "")
      setHasPartner(!!student.Partner)
      setHasKids(!!student.Kids?.length)
      setKids(student.Kids || [])
      setExpectedClasses(student.expectedClasses || [])
    }
  }, [isEdit, student])

  async function onSubmit(values: TStudentSchema) {
    if (isEdit && !student) return
    const result = await (isEdit && student
      ? updateStudent(values, student.id)
      : addStudent(values))
    if (result.errors) {
      const { errors } = result

      if (isString(errors)) {
        toast.error(errors)
      } else {
        if (errors.fullName) {
          form.setError("fullName", { message: errors.fullName })
        }

        if (errors.phoneNumber) {
          form.setError("phoneNumber", { message: errors.phoneNumber })
        }
        if (errors.address) {
          form.setError("address", { message: errors.address })
        }
        if (errors.email) {
          form.setError("email", { message: errors.email })
        }
        if (errors.age) {
          form.setError("age", { message: errors.age })
        }
        if (errors.ageCategory) {
          form.setError("ageCategory", { message: errors.ageCategory })
        }
        if (errors.type) {
          form.setError("type", { message: errors.type })
        }
        if (errors.level) {
          form.setError("level", { message: errors.level })
        }
        if (errors.whatsappNumber) {
          form.setError("whatsappNumber", { message: errors.whatsappNumber })
        }
        if (errors.parentName) {
          form.setError("parentName", { message: errors.parentName })
        }
        if (errors.parentNumber) {
          form.setError("parentNumber", { message: errors.parentNumber })
        }
        if (errors.parentEmail) {
          form.setError("parentEmail", { message: errors.parentEmail })
        }

        if (errors.parentOccupation) {
          form.setError("parentOccupation", { message: errors.parentOccupation })
        }
        if (errors.schoolYear) {
          form.setError("schoolYear", { message: errors.schoolYear })
        }
      }
    } else {
      if (isEdit) toast.success(`Student ${values.fullName} has been updated successfully`)
      else toast.success(`Student  ${values.fullName} has been added successfully`)

      form.reset()
      push("/dashboard/students")
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid w-full grid-cols-4 gap-5 px-2'>
        {!isEdit && (
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem className='col-span-4'>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={value => {
                    setType(value)
                    field.onChange(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='individual'>Individual</SelectItem>
                    <SelectItem value='family'>Family</SelectItem>
                    <SelectItem value='special'>Special</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!isEdit && type === "individual" && (
          <FormField
            control={form.control}
            name='ageCategory'
            render={({ field }) => (
              <FormItem className='col-span-4'>
                <FormLabel>Age Category</FormLabel>
                <Select
                  onValueChange={value => {
                    setAgeCategory(value)
                    field.onChange(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {<SelectItem value='adult'>Adult</SelectItem>}
                    <SelectItem value='kid'>Kid</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        )}{" "}
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          control={form.control}
          name='whatsappNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp / Viber number</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='age'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='level'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>{LEVELS.map(level => level)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sex'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sex</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='male'>Male</SelectItem>
                  <SelectItem value='female'>Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='note'
          render={({ field }) => (
            <FormItem className='col-span-4'>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Accordion type='single' collapsible value={ageCategory} className='col-span-4'>
          <AccordionItem value='kid' className='col-span-4 border-b-0'>
            <AccordionContent className='w-full '>
              <div className='grid grid-cols-4 gap-5'>
                <h1 className='col-span-4 border-b text-base font-bold'>Parent Informations</h1>
                <FormField
                  control={form.control}
                  name='parentName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='parentNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent number</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='parentEmail'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent email</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='parentOccupation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent occupation</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h1 className='col-span-4 border-b text-base font-bold'>School Informations</h1>

                <FormField
                  control={form.control}
                  name='schoolType'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>School Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{SCHOOL_TYPES.map(st => st)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='schoolYear'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>School year</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {!isEdit && type === "family" && (
          <>
            <div className='mb-2 flex items-center space-x-2'>
              <Checkbox
                checked={hasPartner}
                onCheckedChange={checked => setHasPartner(checked as boolean)}
                id='terms'
              />
              <label
                htmlFor='terms'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Has partner
              </label>
            </div>
            <div className='mb-2 flex items-center space-x-2'>
              <Checkbox
                checked={hasKids}
                onCheckedChange={checked => setHasKids(checked as boolean)}
                id='terms'
              />
              <label
                htmlFor='terms'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Has Kids
              </label>
            </div>
          </>
        )}
        {!isEdit && (
          <Accordion
            type='multiple'
            value={[hasPartner ? "partner" : "", hasKids ? "kids" : ""]}
            className='col-span-4'
          >
            <AccordionItem value='partner' className='col-span-4 border-b-0'>
              <AccordionContent className='w-full'>
                <div className='grid grid-cols-2 gap-5 px-2'>
                  <h1 className='col-span-2 border-b text-base font-bold'>Partner Informations</h1>

                  <FormField
                    control={form.control}
                    name='Partner.fullName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner name</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='Partner.phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner phone number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='Partner.email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner email</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='Partner.age'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner age</FormLabel>
                        <FormControl>
                          <Input type='number' {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='Partner.level'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>{LEVELS.map(level => level)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='kids' className='col-span-4 border-b-0'>
              <AccordionContent className='w-full'>
                <div className='mb-2 grid grid-cols-3 gap-5 px-2'>
                  <h1 className='col-span-4 border-b text-base font-bold'>Kid Informations</h1>
                  <FormItem>
                    <FormLabel>Kid's name</FormLabel>
                    <FormControl>
                      <Input
                        value={kid?.fullName || ""}
                        onChange={e => setKid({ ...kid, fullName: e.target.value })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Kid's Sex</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={value =>
                          setKid({ ...kid, level: value as "LN" | "L1" | "L2" | "L3" | "L4" })
                        }
                        defaultValue={kid.level}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='male'>Male</SelectItem>
                          <SelectItem value='Female'>Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Kid's age</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        value={kid?.age || ""}
                        onChange={e => setKid({ ...kid, age: Number(e.target.value) })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <div className='col-span-4 mb-2 grid grid-cols-3 gap-5 px-2'>
                    <FormItem>
                      <FormLabel>Kid's school type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={value =>
                            setKid({
                              ...kid,
                              schoolType: value as "preschool" | "primary" | "middle",
                            })
                          }
                          defaultValue={kid.schoolType}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>{SCHOOL_TYPES.map(st => st)}</SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Kid's school year</FormLabel>
                      <FormControl>
                        <Input
                          value={kid?.schoolYear || ""}
                          onChange={e => setKid({ ...kid, schoolYear: e.target.value })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Kid's level</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={value =>
                            setKid({ ...kid, level: value as "LN" | "L1" | "L2" | "L3" | "L4" })
                          }
                          defaultValue={kid.level}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>{LEVELS.map(level => level)}</SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <div className='col-span-4 flex justify-end'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        const newKid = kidSchema.safeParse(kid)

                        if (newKid.success) {
                          setKids(prev => [...prev, newKid.data])
                          form.setValue("Kids", [...kids, newKid.data])
                          setKid(kidInitialValues)
                        } else
                          toast.error(newKid.error.issues.map(issue => issue.message).join(", "))
                      }}
                    >
                      Add kid
                    </Button>
                  </div>
                </div>
                <div>
                  <h1 className='col-span-4 mb-2 border-b text-base font-bold'>Kids list</h1>
                  <div className='grid grid-cols-3 gap-5 px-2'>
                    {kids.map((k, index) => (
                      <div
                        key={index}
                        className='col-span-4 flex items-center justify-between gap-2'
                      >
                        <p>{k.fullName}</p>
                        <Button
                          type='button'
                          variant='destructive'
                          onClick={() => setKids(kids.filter((_, i) => i !== index))}
                        >
                          <Trash2Icon size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <div className='col-span-4 flex items-center justify-end gap-2'>
          {!isEdit && type !== "family" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' type='button' disabled={isLoading}>
                  {isLoading && <Loader className='animate-spin' />}
                  Add expected classes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className='mb-5'>Select expected classes</DialogTitle>
                  <div className='space-y-3'>
                    {data?.map(c => (
                      <div key={c.id!} className='flex items-center gap-2'>
                        <Checkbox
                          checked={expectedClasses.some(ec => ec === c.id)}
                          onCheckedChange={checked => {
                            if (checked) {
                              setExpectedClasses(prev => [...prev, c.id!])
                              form.setValue("expectedClasses", [...expectedClasses, c.id!])
                            } else {
                              setExpectedClasses(prev => prev.filter(ec => ec !== c.id))
                              form.setValue(
                                "expectedClasses",
                                expectedClasses.filter(ec => ec !== c.id)
                              )
                            }
                          }}
                        />
                        <label className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                          {c.title} - {capitalize(c.day)} from {c.startTime} to {c.endTime}
                        </label>
                      </div>
                    ))}
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader className='animate-spin' />}
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

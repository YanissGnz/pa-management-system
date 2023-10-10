"use client"

import { isString } from "lodash"
// form
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// types
import { TTeacherSchema, teacherSchema } from "@/types/Teacher"
// actions
import { addTeacher } from "@/app/actions"
// components
import { Loader } from "lucide-react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

export default function AddTeacherForm({ handleClose }: { handleClose: () => void }) {
  const form = useForm<TTeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
    },
  })
  async function onSubmit(values: TTeacherSchema) {
    const result = await addTeacher(values)
    if (result.errors) {
      const { errors } = result

      if (isString(errors)) {
        toast.error(errors)
      } else {
        if (errors.firstName) {
          form.setError("firstName", { message: errors.firstName })
        }
        if (errors.lastName) {
          form.setError("lastName", { message: errors.lastName })
        }
        if (errors.email) {
          form.setError("email", { message: errors.email })
        }
        if (errors.phoneNumber) {
          form.setError("phoneNumber", { message: errors.phoneNumber })
        }
        if (errors.address) {
          form.setError("address", { message: errors.address })
        }
        if (errors.password) {
          form.setError("password", { message: errors.password })
        }
      }
    } else {
      toast.success("Teacher added successfully")
      handleClose()
      form.reset()
    }
  }
  return (
    <ScrollArea className='h-full w-full !overflow-x-visible'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2 px-2'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem className='grid grid-cols-4 items-center gap-4'>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} className='col-span-3' />
                </FormControl>

                <FormMessage className='col-span-4' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem className='grid grid-cols-4 items-center gap-4'>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} className='col-span-3' />
                </FormControl>
                <FormMessage className='col-span-4' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='grid grid-cols-4 items-center gap-4'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} className='col-span-3' />
                </FormControl>
                <FormMessage className='col-span-4' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='grid grid-cols-4 items-center gap-4'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} className='col-span-3' />
                </FormControl>
                <FormMessage className='col-span-4' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <>
                <FormItem className='grid grid-cols-4 items-center gap-4'>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input {...field} className='col-span-3' value={field.value || ""} />
                  </FormControl>
                  <FormMessage className='col-span-4' />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem className='grid grid-cols-4 items-center gap-4'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} className='col-span-3' value={field.value || ""} />
                </FormControl>
                <FormMessage className='col-span-4' />
              </FormItem>
            )}
          />

          <SheetFooter>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader className='animate-spin' />}
              Submit
            </Button>
            <SheetClose asChild>
              <Button type='reset' variant='secondary'>
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </FormProvider>
    </ScrollArea>
  )
}

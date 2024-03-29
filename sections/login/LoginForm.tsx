"use client"

import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
// React Hook Form
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signIn, useSession } from "next-auth/react"
// components
import { AlertCircle, Loader2 } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// types
import { TLoginSchema, loginSchema } from "@/types/Login"

export default function LoginForm() {
  const session = useSession()

  const { push } = useRouter()

  const [error, setError] = useState<string | null>(null)
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: TLoginSchema) {
    const { username, password } = values

    const response = await signIn("credentials", {
      redirect: false,
      username,
      password,
    })

    if (response?.error) {
      setError(response.error)
      return
    }

    push("/dashboard/students")
  }

  if (session.status === "authenticated") {
    redirect("/dashboard/students")
  }

  return (
    <div className='w-full px-5 sm:px-10 md:w-1/2 lg:w-1/3'>
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2 px-2'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='Enter you username' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='mb-5'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='Enter a password' {...field} type='password' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={form.formState.isSubmitting} type='submit'>
            {form.formState.isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Login
          </Button>
        </form>
      </Form>
    </div>
  )
}

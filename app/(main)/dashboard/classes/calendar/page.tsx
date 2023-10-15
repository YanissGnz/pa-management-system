import Link from "next/link"
import { Metadata } from "next"
// import { getSessions } from "@/lib/apis"
// components

import { ListIcon } from "lucide-react"
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import { Button } from "@/components/ui/button"
import CalendarView from "@/sections/classes/CalendarView"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Classes Calendar",
  description: "Classes calendar",
}

export default async function ClassesList() {
  const sessions = await prisma.session.findMany({
    include: {
      level: { select: { id: true, name: true } },
      teacher: true,
      program: {
        select: {
          id: true,
          name: true,
        },
      },
      students: {
        select: {
          id: true,
          fullName: true,
          email: true,
          age: true,
          level: true,
          paymentStatus: true,
          schoolType: true,
        },
      },
    },
  })
  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs
        heading='Classes Calendar'
        action={
          <div className='inline-flex gap-5'>
            <Button asChild variant={"outline"}>
              <Link href='/dashboard/classes' className='inline-flex gap-2'>
                <ListIcon className='h-5 w-5' />
                List
              </Link>
            </Button>

            <Button asChild>
              <Link href='/dashboard/classes/add'>Add class</Link>
            </Button>
          </div>
        }
      />
      <CalendarView sessions={sessions} />
    </main>
  )
}

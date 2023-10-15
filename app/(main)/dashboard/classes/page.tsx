import Link from "next/link"
import { Metadata } from "next"
import { getClasses } from "@/lib/apis"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import ClassDialogs from "@/sections/classes/ClassDialogs"
import DataTable from "./data-table"
import columns from "./columns"

export const metadata: Metadata = {
  title: "Classes",
  description: "Classes list page",
}

export default async function ClassesList() {
  const classes = await getClasses()

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs
        heading='Classes'
        action={
          <div className='inline-flex gap-5'>
            <Button asChild variant={"outline"}>
              <Link href='/dashboard/classes/calendar' className='inline-flex gap-2'>
                <CalendarIcon className='h-5 w-5' />
                Calendar
              </Link>
            </Button>

            <Button asChild>
              <Link href='/dashboard/classes/add'>Add class</Link>
            </Button>
          </div>
        }
      />

      <DataTable columns={columns} data={classes} />

      <ClassDialogs />
    </main>
  )
}

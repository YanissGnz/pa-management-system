import { Metadata } from "next"
import { getStudents } from "@/lib/apis"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import StudentDialogs from "@/sections/students/StudentDialogs"
import columns from "./columns"
import { DataTable } from "./data-table"

export const metadata: Metadata = {
  title: "Students",
  description: "Students list page",
}

export default async function StudentsList() {
  const students = await getStudents()

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs
        heading='Students'
        action={
          <Button asChild>
            <Link href='/dashboard/students/add'>Add Student</Link>
          </Button>
        }
      />

      <DataTable columns={columns} data={students} />

      <StudentDialogs />
    </main>
  )
}

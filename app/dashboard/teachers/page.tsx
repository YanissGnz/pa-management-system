import { Metadata } from "next"
import { getTeachers } from "@/lib/apis"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import DataTable from "./data-table"
import columns from "./columns"
import AddTeacher from "./add-teacher-sheet"

export const metadata: Metadata = {
  title: "Teachers",
  description: "Teachers list page",
}

export default async function TeachersList() {
  const teachers = await getTeachers()

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading='Teachers' action={<AddTeacher />} />

      <DataTable columns={columns} data={teachers} />
    </main>
  )
}

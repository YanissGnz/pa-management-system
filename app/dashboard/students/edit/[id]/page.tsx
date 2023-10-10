import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import AddEditStudentForm from "@/sections/students/AddEditStudentForm"
import { getStudentById } from "@/lib/apis"

export const metadata: Metadata = {
  title: "Edit Student",
  description: "Edit Student",
}

export default async function StudentsList({ params: { id } }: { params: { id: string } }) {
  const student = await getStudentById(id)

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading='Edit Student' />

      <AddEditStudentForm isEdit student={student} />
    </main>
  )
}

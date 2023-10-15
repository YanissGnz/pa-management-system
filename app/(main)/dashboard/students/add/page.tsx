import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import AddEditStudentForm from "@/sections/students/AddEditStudentForm"

export const metadata: Metadata = {
  title: "New Student",
  description: "New Student list page",
}

export default async function StudentsList() {
  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading='New Student' />

      <AddEditStudentForm />
    </main>
  )
}

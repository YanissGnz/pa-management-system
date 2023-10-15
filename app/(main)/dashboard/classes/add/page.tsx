import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import AddClassForm from "@/sections/classes/AddEditClassForm"

export const metadata: Metadata = {
  title: "New Class",
  description: "New Class",
}

export default async function StudentsList() {
  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading='New Class' />

      <AddClassForm />
    </main>
  )
}

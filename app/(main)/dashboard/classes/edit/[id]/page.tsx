import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import AddEditClassForm from "@/sections/classes/AddEditClassForm"
import { getClassById } from "@/lib/apis"

export const metadata: Metadata = {
  title: "Edit Class",
  description: "Edit Class list page",
}

export default async function ClassList({ params: { id } }: { params: { id: string } }) {
  const Class = await getClassById(id)

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading='Edit Class' />

      <AddEditClassForm isEdit currentClass={Class} />
    </main>
  )
}

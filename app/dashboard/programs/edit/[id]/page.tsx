import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import AddEditProgramForm from "@/sections/programs/AddEditProgramForm"
import { getProgramById } from "@/lib/apis"

export const metadata: Metadata = {
  title: "Edit Program",
  description: "Edit Program",
}

export default async function ProgramsList({ params: { id } }: { params: { id: string } }) {
  const program = await getProgramById(id)

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading='Edit Program' />

      <AddEditProgramForm isEdit currentProgram={program} />
    </main>
  )
}

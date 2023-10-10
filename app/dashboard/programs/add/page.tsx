import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import AddProgramForm from "@/sections/programs/AddProgramForm"

export const metadata: Metadata = {
  title: "Program Student",
  description: "Program Student list page",
}

export default async function StudentsList() {
  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading='Program Student' />

      <AddProgramForm />
    </main>
  )
}

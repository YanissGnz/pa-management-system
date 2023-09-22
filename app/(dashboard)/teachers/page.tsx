import { Metadata } from "next"
// types
import { Plus } from "lucide-react"
import { TTeacherSchema } from "@/types/Teacher"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import DataTable from "./data-table"
import columns from "./columns"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Teachers",
  description: "Teachers list page",
}

async function getData(): Promise<TTeacherSchema[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      firstName: "John",
      lastName: "Doe",
      email: "guendouziyaniss@gmail.com",
      address: "1234 Main St",
      phoneNumber: "1234567890",
      password: "1234567890",
    },
    {
      id: "728ed32f",
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@gmail.com",
      address: "1234 Main St",
      phoneNumber: "1234567890",
      password: "1234567890",
    },

    // return z.array(taskSchema).parse(tasks)
  ]
}

export default async function TeachersList() {
  const data = await getData()

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs
        heading='Teachers'
        action={
          <Button>
            <Plus />
            Add a teacher
          </Button>
        }
      />

      <DataTable columns={columns} data={data} />
    </main>
  )
}

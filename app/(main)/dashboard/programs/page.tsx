import { Metadata } from "next"
import { getPrograms } from "@/lib/apis"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DataTable from "./data-table"
import columns from "./columns"

export const metadata: Metadata = {
  title: "Programs",
  description: "Programs list page",
}

export default async function programsList() {
  const programs = await getPrograms()

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs
        heading='Programs'
        action={
          <Button asChild>
            <Link href='/dashboard/programs/add'>Add a program</Link>
          </Button>
        }
      />

      <DataTable columns={columns} data={programs} />
    </main>
  )
}

import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AccountingDialogs from "@/sections/accounting/AccountingDialogs"
import { getPayments } from "@/lib/apis"
import DataTable from "./data-table"
import columns from "./columns"

export const metadata: Metadata = {
  title: "Accounting",
  description: "Accounting list page",
}

export default async function AccountingList() {
  const payments = await getPayments()

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs
        heading='Accounting'
        action={
          <Button asChild>
            <Link href='/dashboard/accounting/add'>Add Payment</Link>
          </Button>
        }
      />

      <DataTable columns={columns} data={payments} />
      <AccountingDialogs />
    </main>
  )
}

import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AccountingDialogs from "@/sections/accounting/payments/PaymentsDialogs"
import { getPayments } from "@/lib/apis"
import DataTable from "./data-table"
import columns from "./columns"

export const metadata: Metadata = {
  title: "Expenses",
  description: "Expenses list page",
}

export default async function ExpensesList() {
  const payments = await getPayments()

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs
        heading='Expenses'
        action={
          <Button asChild>
            <Link href='/dashboard/accounting/add'>Add Expense</Link>
          </Button>
        }
      />

      <DataTable columns={columns} data={payments} />
      <AccountingDialogs />
    </main>
  )
}

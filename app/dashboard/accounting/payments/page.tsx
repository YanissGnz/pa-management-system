import { Metadata } from "next"
import Link from "next/link"
import { getPayments } from "@/lib/apis"
import { PATHS } from "@/lib/routes"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import { Button } from "@/components/ui/button"
import PaymentsDialogs from "@/sections/accounting/payments/PaymentsDialogs"
import DataTable from "./data-table"
import columns from "./columns"

export const metadata: Metadata = {
  title: "Payments",
  description: "Payments list page",
}

export default async function PaymentsList() {
  const payments = await getPayments()

  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs
        heading='Payments'
        action={
          <Button asChild>
            <Link href={PATHS.accounting.payments.create}>Add Payment</Link>
          </Button>
        }
      />

      <DataTable columns={columns} data={payments} />
      <PaymentsDialogs />
    </main>
  )
}

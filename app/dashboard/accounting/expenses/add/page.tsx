import { Metadata } from "next"
// components
import HeaderBreadcrumbs from "@/components/ui/HeaderBreadcrumbs"
import AddPaymentForm from "@/sections/accounting/payments/AddPaymentForm"

export const metadata: Metadata = {
  title: "New Payment",
  description: "New Payment list page",
}

export default async function AddPayment() {
  return (
    <main className='flex flex-1 flex-col p-4'>
      <HeaderBreadcrumbs heading='New Payment' />

      <AddPaymentForm />
    </main>
  )
}

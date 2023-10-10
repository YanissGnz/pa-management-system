"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArchiveIcon, CheckCircleIcon, MoreHorizontalIcon, PrinterIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import DataTableColumnHeader from "@/components/ui/data-table-column"
import { completePayment } from "@/app/actions"
import { TPaymentSchema } from "@/types/Payment"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { store } from "@/app/store"
import { openDialog } from "@/app/store/slices/deleteDialogSlice"
import { openDialog as openPrintDialog } from "@/app/store/slices/printDialogSlice"

const handleCompletePayment = async (id: string) => {
  const promise = new Promise((resolve, reject) => {
    completePayment(id)
      .then(result => {
        if (result.success) {
          resolve("Payment completed successfully")
        } else {
          reject()
        }
      })
      .catch(() => {
        reject()
      })
  })
  toast.promise(promise, {
    loading: "Completing payment...",
    success: () => "Payment completed successfully",
    error: "Error completing payment",
  })
}

const columns: ColumnDef<TPaymentSchema>[] = [
  {
    id: "student",
    accessorFn: ({ students }) => students && students[0].fullName,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Student' />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({
      row: {
        original: { date },
      },
    }) => format(new Date(date), "PP"),
  },
  {
    accessorKey: "due",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Due Date' />,
    cell: ({
      row: {
        original: { due },
      },
    }) => format(new Date(due), "PP"),
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Total to pay' />,
    cell: ({
      row: {
        original: { total },
      },
    }) => <span className='font-semibold'>{total} Da</span>,
  },
  {
    accessorKey: "payedAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Payed Amount' />,
    cell: ({
      row: {
        original: { payedAmount },
      },
    }) => <span className='font-semibold'>{payedAmount} Da</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({
      row: {
        original: { status },
      },
    }) => {
      if (status === "completed") return <Badge variant='success'>Completed</Badge>
      if (status === "not paid") return <Badge variant='destructive'>Not Paid</Badge>
      return <Badge variant='default'>Incomplete</Badge>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: true,
    enableGlobalFilter: false,
    cell: ({ row: { original } }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size={"icon"}>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontalIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => store.dispatch(openPrintDialog(original))}>
            <PrinterIcon className='mr-2 h-4 w-4' />
            Print
          </DropdownMenuItem>
          {original.status !== "completed" && (
            <DropdownMenuItem onClick={() => handleCompletePayment(original.id)}>
              <CheckCircleIcon className='mr-2 h-4 w-4' />
              Complete Payment
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => store.dispatch(openDialog(original.id))}
            className='text-red-500 hover:!text-red-600'
          >
            <ArchiveIcon className='mr-2 h-4 w-4' />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default columns

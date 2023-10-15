"use client"

import React, { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DataTablePagination from "@/components/ui/data-table-paggination"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ArchiveIcon, CheckCircleIcon, PrinterIcon } from "lucide-react"
import { useAppDispatch } from "@/app/store/hooks"
import { TPaymentSchema } from "@/types/Payment"
import { completePayment } from "@/app/actions"
import { toast } from "sonner"
import { openDialog } from "@/app/store/slices/deleteDialogSlice"
import { openDialog as openPrintDialog } from "@/app/store/slices/printDialogSlice"

import DataTableToolbar from "./data-table-toolbar"

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

interface DataTableProps<TValue> {
  columns: ColumnDef<TPaymentSchema, TValue>[]
  data: TPaymentSchema[]
}

export default function DataTable<TValue>({ columns, data }: DataTableProps<TValue>) {
  const dispatch = useAppDispatch()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

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

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <ContextMenu key={row.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuLabel>Actions</ContextMenuLabel>
                    <ContextMenuItem onClick={() => dispatch(openPrintDialog(row.original))}>
                      <PrinterIcon className='mr-2 h-4 w-4' />
                      Print
                    </ContextMenuItem>{" "}
                    {row.original.status !== "completed" && (
                      <ContextMenuItem onClick={() => handleCompletePayment(row.original.id)}>
                        <CheckCircleIcon className='mr-2 h-4 w-4' />
                        Complete Payment
                      </ContextMenuItem>
                    )}
                    <ContextMenuItem
                      onClick={() => dispatch(openDialog(row.original.id))}
                      className='text-red-500 hover:!text-red-600'
                    >
                      <ArchiveIcon className='mr-2 h-4 w-4' />
                      Archive
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

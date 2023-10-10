"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
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
import Link from "next/link"
import { Edit2Icon, ReplaceIcon, Trash2Icon, UserPlusIcon } from "lucide-react"
import { TStudentSchema } from "@/types/Student"
import { useAppDispatch } from "@/app/store/hooks"
import { openAssignDialog } from "@/app/store/slices/assignToClassDialog"
import { openDialog } from "@/app/store/slices/deleteDialogSlice"
import { openStudentDetails } from "@/app/store/slices/studentsDetailsSlice"
import DataTableToolbar from "./data-table-toolbar"

interface DataTableProps<TValue> {
  columns: ColumnDef<TStudentSchema, TValue>[]
  data: TStudentSchema[]
}

export function DataTable<TValue>({ columns, data }: DataTableProps<TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const dispatch = useAppDispatch()

  const table = useReactTable({
    data,
    columns,
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
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='max-w-full space-y-4'>
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
                        <TableCell
                          key={cell.id}
                          onDoubleClick={() => {}}
                          className='cursor-pointer'
                          onClick={() => dispatch(openStudentDetails(row.original))}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuLabel>Actions for {row.original.fullName}</ContextMenuLabel>
                    <ContextMenuItem asChild>
                      <Link href={`/dashboard/students/edit/${row.original.id}`}>
                        <Edit2Icon className='mr-2 h-4 w-4' />
                        Edit
                      </Link>
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => dispatch(openAssignDialog(row.original.id))}>
                      {row.original.classes && row.original.classes?.length > 0 ? (
                        <>
                          <ReplaceIcon className='mr-2 h-4 w-4' />
                          Change class
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className='mr-2 h-4 w-4' />
                          Assign to class
                        </>
                      )}
                    </ContextMenuItem>
                    <ContextMenuItem
                      className='text-red-500 hover:text-red-500'
                      onClick={() => dispatch(openDialog(row.original.id))}
                    >
                      <Trash2Icon className='mr-2 h-4 w-4' />
                      Delete
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

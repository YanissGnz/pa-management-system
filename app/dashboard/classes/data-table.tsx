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
import {
  CalendarCheck2Icon,
  ClipboardListIcon,
  Edit2Icon,
  Trash2Icon,
  UserPlus,
} from "lucide-react"
import { TClassSchema } from "@/types/Class"
import { useAppDispatch } from "@/app/store/hooks"
import { openAssignStudentsDialog, openEndClassDialog } from "@/app/store/slices/classDialogSlice"
import { openDialog } from "@/app/store/slices/deleteDialogSlice"
import Link from "next/link"
import { PATHS } from "@/lib/routes"
import { openAttendanceSheetDialog } from "@/app/store/slices/attendanceSheetDialog"
import DataTableToolbar from "./data-table-toolbar"

const fuzzyFilter: FilterFn<TClassSchema> = (row, columnId, value, addMeta) => {
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
  columns: ColumnDef<TClassSchema, TValue>[]
  data: TClassSchema[]
}

export default function DataTable<TValue>({ columns, data }: DataTableProps<TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const dispatch = useAppDispatch()

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
                    <ContextMenuLabel>Actions for {row.original.title}</ContextMenuLabel>
                    <ContextMenuItem asChild>
                      <Link href={PATHS.classes.edit(row.original.id!)}>
                        <Edit2Icon className='mr-2 h-4 w-4' />
                        Edit
                      </Link>
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => dispatch(openAssignStudentsDialog(row.original.id!))}
                    >
                      <UserPlus className='mr-2 h-4 w-4' />
                      Assign Students
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={e => {
                        e.stopPropagation()
                        dispatch(openAttendanceSheetDialog(row.original.id!))
                      }}
                    >
                      <ClipboardListIcon className='mr-2 h-4 w-4' />
                      Fill attendance sheet
                    </ContextMenuItem>
                    {row.original.endDate! < new Date() && (
                      <ContextMenuItem
                        className='text-red-500 hover:text-red-500'
                        onClick={e => {
                          e.stopPropagation()
                          dispatch(openEndClassDialog(row.original.id!))
                        }}
                      >
                        <CalendarCheck2Icon className='mr-2 h-4 w-4' />
                        End class
                      </ContextMenuItem>
                    )}
                    <ContextMenuItem
                      className='text-red-500 hover:text-red-500'
                      onClick={() => dispatch(openDialog(row.original.id!))}
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

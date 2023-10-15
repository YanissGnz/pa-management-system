"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  CircleDollarSignIcon,
  Edit2Icon,
  MoreHorizontal,
  ReplaceIcon,
  Trash2Icon,
  UserPlus,
} from "lucide-react"
import { TStudentSchema } from "@/types/Student"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import DataTableColumnHeader from "@/components/ui/data-table-column"
import { Badge } from "@/components/ui/badge"
import { store } from "@/app/store"
import { openDialog } from "@/app/store/slices/deleteDialogSlice"
import { openAssignDialog } from "@/app/store/slices/assignToClassDialog"
import Link from "next/link"
import { PATHS } from "@/lib/routes"

const columns: ColumnDef<TStudentSchema>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Full Name' />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "type",
    cell: ({
      row: {
        original: { type },
      },
    }) => {
      if (type === "family") {
        return <p>Family</p>
      }
      if (type === "special") {
        return <p>Special</p>
      }
      return <p>Individual</p>
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableGlobalFilter: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "age",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Age' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableGlobalFilter: false,
    enableColumnFilter: true,
  },
  {
    accessorKey: "level",
    cell: ({
      row: {
        original: { level },
      },
    }) => <p className='capitalize'>{level}</p>,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Level' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableGlobalFilter: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "sex",
    cell: ({
      row: {
        original: { sex },
      },
    }) => <p className='capitalize'>{sex}</p>,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sex' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableGlobalFilter: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "ageCategory",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Age Category' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableGlobalFilter: false,
    enableColumnFilter: true,
  },
  {
    accessorKey: "registrationStatus",
    cell: ({
      row: {
        original: { registrationStatus },
      },
    }) => {
      if (registrationStatus === "registered") {
        return (
          <Badge variant='success' className='capitalize'>
            Registered
          </Badge>
        )
      }
      return (
        <Badge variant='outline' className='capitalize'>
          Pre-registered
        </Badge>
      )
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Registration status' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableGlobalFilter: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "paymentStatus",
    cell: ({
      row: {
        original: { paymentStatus },
      },
    }) => {
      if (paymentStatus === "completed") {
        return (
          <Badge variant='success' className='capitalize'>
            Completed
          </Badge>
        )
      }
      if (paymentStatus === "incomplete") {
        return (
          <Badge variant='default' className='capitalize'>
            Incomplete
          </Badge>
        )
      }

      return (
        <Badge variant='destructive' className='capitalize'>
          Not Paid
        </Badge>
      )
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Payment status' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableGlobalFilter: true,
    enableColumnFilter: true,
  },
  {
    id: "class",
    cell: ({
      row: {
        original: { classes },
      },
    }) => (
      <p>
        {classes && classes.length > 0 ? (
          <div>
            <p>{classes[0].title}</p>
            <p>
              {classes[0].startTime} to {classes[0].endTime}
            </p>
          </div>
        ) : (
          "Not assigned"
        )}
      </p>
    ),
    header: ({ column }) => <DataTableColumnHeader column={column} title='Class' />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableGlobalFilter: true,
    enableColumnFilter: true,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader className='flex w-full justify-end' column={column} title='Actions' />
    ),
    enableHiding: true,
    enableGlobalFilter: false,
    cell: ({ row: { original } }) => (
      <div className='flex w-full justify-end gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size={"icon"}>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild onClick={e => e.stopPropagation()}>
              <Link href={PATHS.students.edit(original.id)}>
                <Edit2Icon className='mr-2 h-4 w-4' />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={e => e.stopPropagation()}>
              <Link href={`${PATHS.accounting.create}?studentId=${original.id}`}>
                <CircleDollarSignIcon className='mr-2 h-4 w-4' />
                Add payment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation()
                store.dispatch(openAssignDialog(original.id))
              }}
            >
              {original.classes && original.classes?.length > 0 ? (
                <>
                  <ReplaceIcon className='mr-2 h-4 w-4' />
                  Change class
                </>
              ) : (
                <>
                  <UserPlus className='mr-2 h-4 w-4' />
                  Assign to class
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-500 hover:text-red-500'
              onClick={e => {
                e.stopPropagation()
                store.dispatch(openDialog(original.id))
              }}
            >
              <Trash2Icon className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

export default columns

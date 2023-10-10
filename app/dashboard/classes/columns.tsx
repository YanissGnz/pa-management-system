"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit2Icon, MoreHorizontal, Trash2Icon, UserPlus } from "lucide-react"
import { TClassSchema } from "@/types/Class"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import DataTableColumnHeader from "@/components/ui/data-table-column"
import { format } from "date-fns"
import { capitalize } from "lodash"
import { Badge } from "@/components/ui/badge"
import { store } from "@/app/store"
import { openAssignStudentsDialog } from "@/app/store/slices/assignStudentsDialog"
import { openDialog } from "@/app/store/slices/deleteDialogSlice"
import Link from "next/link"
import { PATHS } from "@/lib/routes"

const columns: ColumnDef<TClassSchema>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
  },
  {
    accessorKey: "teacher",
    accessorFn: ({ teacher }) => `${teacher?.firstName} ${teacher?.lastName}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Teacher' />,
  },
  {
    id: "program",
    accessorFn: ({ program, level }) => `${program?.name} - ${level?.name}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Teacher' />,
  },
  {
    id: "day",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Day Time' />,
    cell: ({
      row: {
        original: { day, endTime, startTime },
      },
    }) => (
      <div>
        <Badge variant={"outline"} className='mb-2'>
          {capitalize(day)}
        </Badge>{" "}
        <br />
        <Badge variant={"outline"}>{startTime}</Badge> to{" "}
        <Badge variant={"outline"}>{endTime}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Start date' />,
    cell: ({
      row: {
        original: { startDate },
      },
    }) => format(new Date(startDate), "PPP"),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title='End Date' />,
    cell: ({
      row: {
        original: { endDate },
      },
    }) => format(new Date(endDate), "PPP"),
  },
  {
    id: "studentsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Students Count' />,
    cell: ({
      row: {
        original: { students },
      },
    }) => `${students ? students.length : 0} / 15`,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: true,
    enableGlobalFilter: false,
    cell: ({
      row: {
        original: { id },
      },
    }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size={"icon"}>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={PATHS.classes.edit(id!)}>
              <Edit2Icon className='mr-2 h-4 w-4' />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => store.dispatch(openAssignStudentsDialog(id!))}>
            <UserPlus className='mr-2 h-4 w-4' />
            Assign Students
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-red-500 hover:text-red-500'
            onClick={() => store.dispatch(openDialog(id!))}
          >
            <Trash2Icon className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default columns

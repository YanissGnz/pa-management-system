"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  CalendarCheck2Icon,
  ClipboardListIcon,
  Edit2Icon,
  MoreHorizontal,
  Trash2Icon,
  UserPlus,
} from "lucide-react"
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
import { openAssignStudentsDialog, openEndClassDialog } from "@/app/store/slices/classDialogSlice"
import { openDialog } from "@/app/store/slices/deleteDialogSlice"
import Link from "next/link"
import { PATHS } from "@/lib/routes"
import { openAttendanceSheetDialog } from "@/app/store/slices/attendanceSheetDialog"

const columns: ColumnDef<TClassSchema>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
  },
  {
    accessorKey: "teacher",
    accessorFn: ({ teacher }) =>
      teacher ? `${teacher?.firstName} ${teacher?.lastName}` : "Not assigned",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Teacher' />,
  },
  {
    id: "program",
    accessorFn: ({ program, level }) =>
      program && level ? `${program?.name} - ${level?.name}` : "No program",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Program/Level' />,
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
    id: "studentsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Students Count' />,
    cell: ({
      row: {
        original: { students },
      },
    }) => `${students ? students.length : 0} / 20`,
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
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={PATHS.classes.edit(original.id!)}>
              <Edit2Icon className='mr-2 h-4 w-4' />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              store.dispatch(openAssignStudentsDialog(original.id!))
            }}
          >
            <UserPlus className='mr-2 h-4 w-4' />
            Assign Students
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              store.dispatch(openAttendanceSheetDialog(original.id!))
            }}
          >
            <ClipboardListIcon className='mr-2 h-4 w-4' />
            Fill attendance sheet
          </DropdownMenuItem>
          {original.endDate! < new Date() && (
            <DropdownMenuItem
              className='text-red-500 hover:text-red-500'
              onClick={e => {
                e.stopPropagation()
                store.dispatch(openEndClassDialog(original.id!))
              }}
            >
              <CalendarCheck2Icon className='mr-2 h-4 w-4' />
              End class
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className='text-red-500 hover:text-red-500'
            onClick={e => {
              e.stopPropagation()
              store.dispatch(openDialog(original.id!))
            }}
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

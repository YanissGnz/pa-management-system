"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react"
import { TTeacherSchema } from "@/types/Teacher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import DataTableColumnHeader from "@/components/ui/data-table-column"
import { deleteTeacher } from "@/app/actions"
import { toast } from "sonner"

const handleDelete = async (id: string) => {
  const result = await deleteTeacher(id)

  if (result.success) {
    toast.success("Teacher deleted successfully")
  } else {
    toast.error("Teacher deletion failed")
  }
}

const columns: ColumnDef<TTeacherSchema>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => <DataTableColumnHeader column={column} title='First Name' />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Last Name' />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "email",

    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phone Number' />,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
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
          <DropdownMenuItem>
            <Edit2Icon className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDelete(id as string)}
            className='text-red-500 hover:!text-red-600'
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

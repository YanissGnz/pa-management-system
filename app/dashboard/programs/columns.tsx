"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import DataTableColumnHeader from "@/components/ui/data-table-column"
import { deleteProgram } from "@/app/actions"
import { TProgramSchema } from "@/types/Program"
import { toast } from "sonner"
import Link from "next/link"
import { PATHS } from "@/lib/routes"

const handleDelete = async (id: string) => {
  const promise = new Promise((resolve, reject) => {
    deleteProgram(id)
      .then(result => {
        if (result.success) {
          resolve("Program deleted successfully")
        } else {
          reject()
        }
      })
      .catch(() => {
        reject()
      })
  })
  toast.promise(promise, {
    loading: "Deleting program...",
    success: () => "Program deleted successfully",
    error: "Error deleting program",
  })
}

const columns: ColumnDef<TProgramSchema>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    enableGlobalFilter: true,
  },
  {
    id: "levelsCount",
    accessorFn: ({ levels }) => levels.length,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Levels count' />,
    enableGlobalFilter: true,
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
            <Link href={PATHS.programs.edit(id!)}>
              <Edit2Icon className='mr-2 h-4 w-4' />
              Edit
            </Link>
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

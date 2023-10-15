"use client"

import { XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DataTableViewOptions from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

const types = [
  { label: "Individual", value: "individual" },
  { label: "Family", value: "family" },
  { label: "Special", value: "special" },
]

const registrationStatus = [
  { label: "Pre-registered", value: "pre-registered" },
  { label: "Registered", value: "registered" },
]

const paymentStatus = [
  { label: "Completed", value: "completed" },
  { label: "Incomplete", value: "incomplete" },
  { label: "Not Paid", value: "not paid" },
]

const sex = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
]

const ageCategory = [
  { label: "Kid", value: "kid" },
  { label: "Adult", value: "adult" },
]

const levels = [
  { label: "Nursery", value: "NL" },
  { label: "Level 1", value: "L1" },
  { label: "Level 2", value: "L2" },
  { label: "Level 3", value: "L3" },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  setGlobalFilter: (value: string) => void
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div>
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search all columns...'
            className='h-8 w-[150px] lg:w-[250px]'
          />
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div className='flex flex-wrap items-center space-x-2'>
        {table.getColumn("type") && (
          <DataTableFacetedFilter column={table.getColumn("type")} title='Type' options={types} />
        )}{" "}
        {table.getColumn("registrationStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("registrationStatus")}
            title='Registration Status'
            options={registrationStatus}
          />
        )}
        {table.getColumn("paymentStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("paymentStatus")}
            title='Payment Status'
            options={paymentStatus}
          />
        )}
        {table.getColumn("sex") && (
          <DataTableFacetedFilter column={table.getColumn("sex")} title='Sex' options={sex} />
        )}{" "}
        {table.getColumn("ageCategory") && (
          <DataTableFacetedFilter
            column={table.getColumn("ageCategory")}
            title='Age Category'
            options={ageCategory}
          />
        )}
        {table.getColumn("level") && (
          <DataTableFacetedFilter
            column={table.getColumn("level")}
            title='Level'
            options={levels}
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <XIcon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}

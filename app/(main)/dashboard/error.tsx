"use client"

import { AlertCircleIcon } from "lucide-react"

export default function error() {
  return (
    <div className='flex h-screen flex-1 items-center justify-center'>
      <AlertCircleIcon className='text-red-500' size={48} />
    </div>
  )
}

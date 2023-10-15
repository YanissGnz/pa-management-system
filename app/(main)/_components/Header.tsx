"use client"

import { useAppDispatch } from "@/app/store/hooks"
import { openSidebar } from "@/app/store/slices/sidebarSlice"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import React from "react"

export default function Header() {
  const dispatch = useAppDispatch()
  return (
    <header className='w-full px-2 pt-2'>
      <Button variant='ghost' size='icon' onClick={() => dispatch(openSidebar())}>
        <MenuIcon />
      </Button>
    </header>
  )
}

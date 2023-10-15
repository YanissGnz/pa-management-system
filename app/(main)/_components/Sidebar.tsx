"use client"

import { Backpack, Clipboard, DollarSignIcon, DoorOpen, Users } from "lucide-react"
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/app/store/hooks"
import { cn } from "@/lib/utils"
import { useRef } from "react"
import { useOnClickOutside } from "usehooks-ts"
import { closeSidebar } from "@/app/store/slices/sidebarSlice"
import User from "./User"
import NavItem from "./NavItem"

const NAV_ITEMS = [
  {
    name: "Students",
    href: "/dashboard/students",
    icon: <Backpack />,
  },
  {
    name: "Classes",
    href: "/dashboard/classes",
    icon: <DoorOpen />,
  },
  {
    name: "Programs",
    href: "/dashboard/programs",
    icon: <Clipboard />,
  },
  {
    name: "Accounting",
    href: "/dashboard/accounting",
    icon: <DollarSignIcon />,
  },
  {
    name: "Teachers",
    href: "/dashboard/teachers",
    icon: <Users />,
  },
]

export default function Sidebar() {
  const { isOpen } = useAppSelector(state => state.sidebar)
  const dispatch = useAppDispatch()
  const ref = useRef(null)
  const handleClickOutside = () => {
    dispatch(closeSidebar())
  }

  useOnClickOutside(ref, handleClickOutside)

  return (
    <aside
      ref={ref}
      className={cn(
        "h-screen  w-64 border-r border-dashed bg-primary px-2 transition-all dark:bg-background md:relative md:block md:translate-x-0",
        "absolute left-0 top-0 z-50 -translate-x-full border-r border-dashed bg-primary px-2 duration-500 dark:bg-background",
        isOpen && "translate-x-0"
      )}
    >
      <div className='flex w-full justify-center p-2'>
        <Image src='/logo.png' alt='logo' width={40} height={40} />
      </div>
      <User />

      <ul className='mt-1 flex-1 space-y-2 '>
        {NAV_ITEMS.map((item, i) => (
          <NavItem key={i} {...item} />
        ))}
      </ul>
    </aside>
  )
}

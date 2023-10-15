"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/app/store/hooks"
import { closeSidebar } from "@/app/store/slices/sidebarSlice"

type Props = {
  href: string
  name: string
  icon: React.ReactNode
}

export default function NavItem({ href, name, icon }: Props) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  const handleLinkClick = () => dispatch(closeSidebar())

  return (
    <Link
      onClick={handleLinkClick}
      href={href}
      key={name}
      className={cn(
        "flex cursor-pointer items-center space-x-2 rounded p-3 font-bold text-white hover:bg-secondary hover:text-black  dark:hover:text-white",
        pathname.includes(href) && "bg-secondary text-black dark:text-white"
      )}
    >
      <span className='h-6 w-6'>{icon}</span>
      <p className='font-medium'>{name}</p>
    </Link>
  )
}

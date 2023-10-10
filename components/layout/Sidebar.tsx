import { Backpack, Clipboard, DollarSignIcon, DoorOpen, Users } from "lucide-react"
import Image from "next/image"
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
  return (
    <div className='h-screen w-64 border-r border-dashed bg-primary'>
      <div className='flex w-full justify-center p-2'>
        <Image src='/logo.png' alt='logo' width={40} height={40} />
      </div>
      <ul className='mt-1 flex-1 space-y-2 px-2'>
        {NAV_ITEMS.map((item, i) => (
          <NavItem key={i} {...item} />
        ))}
      </ul>
    </div>
  )
}

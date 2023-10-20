import {
  Backpack,
  Clipboard,
  DollarSignIcon,
  DoorOpen,
  PercentCircleIcon,
  Users,
  Wallet,
} from "lucide-react"
import Image from "next/image"
import { PATHS } from "@/lib/routes"
import NavItem from "./NavItem"
import User from "./User"
import { Accordion } from "../ui/accordion"

const NAV_ITEMS: {
  name: string
  href: string
  icon: React.ReactNode
  type: "link" | "accordion"
  subItems?: {
    name: string
    href: string
    icon: React.ReactNode
  }[]
}[] = [
  {
    name: "Students",
    href: PATHS.students.root,
    icon: <Backpack />,
    type: "link",
  },
  {
    name: "Classes",
    href: PATHS.classes.root,
    icon: <DoorOpen />,
    type: "link",
  },
  {
    name: "Programs",
    href: PATHS.programs.root,
    icon: <Clipboard />,
    type: "link",
  },
  {
    name: "Accounting",
    href: "/dashboard/accounting",
    icon: <DollarSignIcon />,
    type: "accordion",
    subItems: [
      {
        name: "Payments",
        href: PATHS.accounting.payments.root,
        icon: <Wallet />,
      },
      {
        name: "Expenses",
        href: PATHS.accounting.expenses.root,
        icon: <PercentCircleIcon />,
      },
    ],
  },
  {
    name: "Teachers",
    href: PATHS.teachers.root,
    icon: <Users />,
    type: "link",
  },
]

export default async function Sidebar() {
  return (
    <div className='h-screen w-64 border-r border-dashed bg-primary px-2 dark:bg-background'>
      <div className='flex w-full justify-center p-2'>
        <Image src='/logo.png' alt='logo' width={40} height={40} />
      </div>
      <User />

      <Accordion type='single' collapsible className='mt-1 flex-1 space-y-2 divide-y-0'>
        {NAV_ITEMS.map((item, i) => (
          <NavItem key={i} {...item} />
        ))}
      </Accordion>
    </div>
  )
}

import { Backpack, Clipboard,  DoorOpen, LayoutDashboard, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/",
    icon: <LayoutDashboard/>,

  },
  {
    name: "Teachers",
    href: "/teachers",
    icon: <Users/>,
  },
  {
    name: "Students",
    href: "/students",
    icon: <Backpack/>,
  },
  {
    name: "Classes",
    href: "/classes",
    icon: <DoorOpen/>,
  },
  {
    name: "Programs",
    href: "/classes",
    icon: <Clipboard />,
  }
]

export default function Sidebar() {
  return (
    <div className="h-screen w-56 border-r border-dashed bg-primary">
      <div className='w-full p-2 flex justify-center'>

      <Image src="/logo.png" alt='logo' width={40} height={40} />
      </div>
      <ul className='px-2 mt-1'>
        {NAV_ITEMS.map((item) => (
          <Link href={item.href} key={item.name} className="flex items-center space-x-2 p-3 rounded hover:bg-secondary hover:text-black text-white  cursor-pointer">
            <span className="w-6 h-6">{item.icon}</span>
            <p>{item.name}</p>
          </Link>  
        ))}
      </ul>
    </div>
  )
}

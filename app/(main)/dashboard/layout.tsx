"use client"

// components
import { redirect } from "next/navigation"
import { useMediaQuery } from "usehooks-ts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"
import Sidebar from "../_components/Sidebar"
import Header from "../_components/Header"

type LayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: LayoutProps) {
  const session = useSession()
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (session.status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className='flex h-screen w-screen flex-col md:flex-row'>
      {isMobile && <Header />}
      <Sidebar />
      <ScrollArea className='w-full md:flex-1'>
        <div className='w-screen md:w-full'>{children}</div>
      </ScrollArea>
    </div>
  )
}

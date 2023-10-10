// components
import Sidebar from "@/components/layout/Sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

type LayoutProps = {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: LayoutProps) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className='flex h-screen w-screen'>
      <Sidebar />
      <ScrollArea className='flex-1'>{children}</ScrollArea>
    </div>
  )
}

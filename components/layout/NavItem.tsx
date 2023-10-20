"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"

type Props = {
  href: string
  name: string
  icon: React.ReactNode
  type: "link" | "accordion"
  subItems?: {
    name: string
    href: string
    icon: React.ReactNode
  }[]
}

const LinkItem = ({
  href,
  name,
  icon,
  isActive,
  className,
}: Omit<Props, "type"> & { isActive: boolean; className?: string }) => (
  <Link
    href={href}
    key={name}
    className={cn(
      "flex cursor-pointer items-center space-x-2 rounded p-3 font-bold text-white hover:bg-secondary hover:text-black  dark:hover:text-white",
      isActive && "bg-secondary text-black dark:text-white",
      className
    )}
  >
    <span className='h-6 w-6'>{icon}</span>
    <p className='font-medium'>{name}</p>
  </Link>
)

export default function NavItem({ href, name, icon, type, subItems }: Props) {
  const pathname = usePathname()

  if (type === "accordion")
    return (
      <AccordionItem value={name}>
        <AccordionTrigger
          className={cn(
            "flex cursor-pointer items-center justify-start space-x-2 rounded p-3 font-bold text-white hover:bg-secondary hover:text-black hover:no-underline  dark:hover:text-white",
            pathname.includes(href) && "bg-secondary text-black dark:text-white"
          )}
        >
          <span className='h-6 w-6'>{icon}</span>
          <p className='flex-1 text-start font-medium'>{name}</p>
        </AccordionTrigger>
        <AccordionContent className='ml-5 mt-1'>
          {subItems?.map(item => (
            <div key={item.name} className='flex items-center'>
              <LinkItem {...item} isActive={pathname.includes(item.href)} className='flex-1' />
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    )

  return (
    <AccordionItem value={name} className='border-0'>
      <LinkItem href={href} name={name} icon={icon} isActive={pathname.includes(href)} />
    </AccordionItem>
  )
}

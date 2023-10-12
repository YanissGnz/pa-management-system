"use client"

import React from "react"
import { LogOutIcon } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"

export default function User() {
  const session = useSession()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='mb-5 flex w-full items-center justify-start gap-2 rounded text-white hover:bg-secondary hover:text-black'>
        <Avatar>
          <AvatarFallback className='text-black'>
            {session.data?.user?.name?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p>{session.data?.user?.name}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

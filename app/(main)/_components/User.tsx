"use client"

import React from "react"
import { LogOutIcon, MoonIcon, MoonStarIcon, SunIcon } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"

export default function User() {
  const session = useSession()

  const { setTheme } = useTheme()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='mb-5 flex w-full items-center justify-start gap-2 rounded text-white hover:bg-secondary hover:text-black dark:hover:text-white'>
        <Avatar>
          <AvatarFallback className='text-black dark:text-white'>
            {session.data?.user?.name?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p>{session.data?.user?.name}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MoonStarIcon className='mr-2 h-4 w-4' />
            <span>Toggle dark mode</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <MoonIcon className='mr-2 h-4 w-4' />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <SunIcon className='mr-2 h-4 w-4' />
                <span>Light</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

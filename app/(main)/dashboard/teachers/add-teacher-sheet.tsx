"use client"

import { useState } from "react"
// icons
import { Plus } from "lucide-react"
// components
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
// sections
import AddTeacherForm from "@/sections/teachers/AddTeacherForm"

export default function AddTeacher() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Sheet open={open} onOpenChange={isOpen => setOpen(isOpen)}>
        <SheetTrigger asChild>
          <Button>
            <Plus /> Add teacher
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add a teacher</SheetTitle>
          </SheetHeader>
          <AddTeacherForm handleClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}

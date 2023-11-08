import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TClassSchema } from "@/types/Class"
import { format } from "date-fns"
import React from "react"

export default function StudentClassesHistory({ classes }: { classes: TClassSchema[] }) {
  return (
    <div>
      <div className='flex flex-col'>
        {classes.length > 0 ? (
          classes.map(c => (
            <Card key={c.id}>
              <CardHeader className='inline-flex items-center justify-between'>
                <h2 className='font-bold'>{c.title}</h2>
              </CardHeader>
              <CardContent>
                <p>{c.level?.name}</p>
                <p>{format(new Date(c.startDate), "PPP")}</p>
                <p>{format(new Date(c.endDate!), "PPP")}</p>
                <p>{c.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-center text-red-500'>No classes found</p>
        )}
      </div>
    </div>
  )
}

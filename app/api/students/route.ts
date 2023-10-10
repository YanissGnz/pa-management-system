import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const students = await prisma.student.findMany({
    include: {
      classes: {
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
        },
      },
      Partner: true,
      Kids: true,
      sessions: true,
      payments: true,
    },
  })

  return NextResponse.json(students, { status: 200 })
}

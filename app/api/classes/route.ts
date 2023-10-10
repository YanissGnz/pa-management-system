import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const classes = await prisma.class.findMany({
    select: {
      id: true,
      title: true,
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      program: {
        select: {
          id: true,
          name: true,
        },
      },
      level: {
        select: {
          id: true,
          name: true,
        },
      },
      students: {
        select: {
          id: true,
          fullName: true,
        },
      },
      startDate: true,
      endDate: true,
      day: true,
      startTime: true,
      endTime: true,
    },
  })
  return NextResponse.json(classes, { status: 200 })
}

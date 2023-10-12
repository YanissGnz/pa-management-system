import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const students = await prisma.student.findMany({
    include: {
      classes: {
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          level: true,
          program: true,
          startDate: true,
          endDate: true,
          day: true,
          teacher: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          students: {
            select: {
              id: true,
            },
          },
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

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

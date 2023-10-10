import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const sessions = await prisma.session.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      color: true,
      start: true,
      end: true,
      level: {
        select: {
          id: true,
          name: true,
        },
      },
      program: {
        select: {
          id: true,
          name: true,
        },
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      students: {
        select: {
          id: true,
          fullName: true,
          level: true,
        },
      },
    },
  })

  return NextResponse.json(sessions, { status: 200 })
}

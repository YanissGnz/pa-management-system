import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const teachers = await prisma.teacher.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      address: true,
      phoneNumber: true,
    },
  })

  return NextResponse.json(teachers, { status: 200 })
}

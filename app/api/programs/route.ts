import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const programs = await prisma.program.findMany({
    select: {
      id: true,
      name: true,
      levels: {
        select: { id: true, name: true },
      },
    },
  })

  return NextResponse.json(programs, { status: 200 })
}

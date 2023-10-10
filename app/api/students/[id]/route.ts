import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const students = await prisma.student.findUnique({ where: { id } })

  return NextResponse.json(students, { status: 200 })
}

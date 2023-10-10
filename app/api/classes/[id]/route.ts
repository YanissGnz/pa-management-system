import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const classObject = await prisma.class.findUnique({ where: { id }, include: { students: true } })

  return NextResponse.json(classObject, { status: 200 })
}

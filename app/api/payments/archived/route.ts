import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const payments = await prisma.payment.findMany({
    where: {
      archived: true,
    },
    select: {
      id: true,
      total: true,
      date: true,
      period: true,
      payedAmount: true,
      payedDate: true,
      status: true,
      due: true,
      students: true,
    },
  })

  return NextResponse.json(payments, { status: 200 })
}

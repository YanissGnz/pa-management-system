import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
  const session = await getServerSession()

  if (!session) {
    return Response.redirect(`${process.env.NEXT_BASE_URL}/login`)
  }
  const payments = await prisma.payment.findMany({
    where: {
      archived: false,
    },
    select: {
      id: true,
      code: true,
      total: true,
      date: true,
      period: true,
      payedAmount: true,
      payedDate: true,
      status: true,
      due: true,
      students: {
        include: {
          classes: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  })

  return Response.json(payments, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

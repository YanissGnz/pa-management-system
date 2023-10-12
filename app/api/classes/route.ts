import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
  const session = await getServerSession()

  if (!session) {
    return Response.redirect(`${process.env.NEXT_BASE_URL}/login`)
  }

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
  return Response.json(classes, { status: 200 })
}
export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

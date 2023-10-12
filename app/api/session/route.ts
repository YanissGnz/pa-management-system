import prisma from "@/lib/prisma"

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

  return Response.json(sessions, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

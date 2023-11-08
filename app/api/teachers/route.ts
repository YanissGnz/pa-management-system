import prisma from "@/lib/prisma"

export async function GET() {
  const teachers = await prisma.teacher.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      address: true,
      phoneNumber: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })

  return Response.json(teachers, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

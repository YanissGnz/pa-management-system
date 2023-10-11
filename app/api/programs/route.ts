import prisma from "@/lib/prisma"

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

  return Response.json(programs, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session) {
    return Response.redirect(`${process.env.NEXT_BASE_URL}/login`)
  }
  const { id } = params

  const students = await prisma.student.findUnique({ where: { id } })

  return Response.json(students, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

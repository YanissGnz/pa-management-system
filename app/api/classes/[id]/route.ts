import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session) {
    return Response.redirect(`${process.env.NEXT_BASE_URL}/login`)
  }
  const { id } = params

  const classObject = await prisma.class.findUnique({ where: { id }, include: { students: true } })

  return Response.json(classObject, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const classObject = await prisma.class.findUnique({ where: { id } })

  const sessions = await prisma.session.findMany({ where: { title: classObject?.title } })

  return Response.json(sessions, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  const program = await prisma.program.findUnique({ where: { id }, include: { levels: true } })

  return Response.json(program, { status: 200 })
}

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"
export const preferredRegion = "auto"

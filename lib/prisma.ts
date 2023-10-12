import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => new PrismaClient()

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

globalForPrisma.prisma = prisma

export default prisma

import NextAuth from "next-auth/next"
import { authOptions } from "@/lib/utils/authOptions"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

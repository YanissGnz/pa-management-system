import { compare } from "bcrypt"
import { type NextAuthOptions } from "next-auth"
// Providers
import CredentialsProvider from "next-auth/providers/credentials"
// Prisma
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        })

        if (!user) {
          return null
        }
        const isValid = await compare(credentials.password, user.password as string)
        if (!isValid) {
          return null
        }
        return user
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    signOut: "/register",
  },
}

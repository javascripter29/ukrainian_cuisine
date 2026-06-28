import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "../schema/zod"
import { getUserFromDb } from "../utils/user"
import prisma from "../utils/prisma"
import bcryptjs from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)
          const user = await getUserFromDb(email)

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcryptjs.compare(password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return { id: user.id, email: user.email }
        } catch {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  }
})

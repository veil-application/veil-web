import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { db } from "@/lib/db"

// Demo / dev-only fallback creds. Used when DEMO_EMAIL / DEMO_PASSWORD are
// not set in the environment (e.g. running off a cloned repo for the first
// time). DO NOT keep these in production builds.
const DEMO_EMAIL_FALLBACK = "rohansen856@gmail.com"
const DEMO_PASSWORD_FALLBACK = "pass123"

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const expectedEmail = (
          process.env.DEMO_EMAIL || DEMO_EMAIL_FALLBACK
        ).toLowerCase()
        const expectedPassword =
          process.env.DEMO_PASSWORD || DEMO_PASSWORD_FALLBACK

        if (
          credentials.email.toLowerCase() !== expectedEmail ||
          credentials.password !== expectedPassword
        ) {
          return null
        }

        // Upsert the demo user so the existing jwt callback (which looks
        // the user up by email) can resolve them. Adapter is a no-op for
        // Credentials provider so we have to materialise the row ourselves.
        const user = await db.user.upsert({
          where: { email: expectedEmail },
          update: {},
          create: {
            email: expectedEmail,
            name: "Demo User",
            emailVerified: new Date(),
          },
        })

        return {
          id: user.id,
          name: user.name ?? "Demo User",
          email: user.email ?? expectedEmail,
          image: user.image ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
}

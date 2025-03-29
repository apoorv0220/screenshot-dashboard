import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { Session, User } from "next-auth"
import type { NextAuthOptions } from "next-auth"


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account }: { token: JWT, account: any }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session({ session, token, user }: { session: Session, token: JWT, user: User }) {
      // session.accessToken = token.accessToken
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { Session, User } from "next-auth"


export const getAuthOptions = ():AuthOptions => {
  return {
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
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token
        }
        return token
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async session({ session, token, user }: { session: Session, token: JWT, user: User }) {
        // Send properties to the client, like an access_token from a provider.
        // session.accessToken = token.accessToken
        return session
      }
    }
  }
}

const handler = NextAuth(getAuthOptions())

export { handler as GET, handler as POST }
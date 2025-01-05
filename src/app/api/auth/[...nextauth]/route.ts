import NextAuth, { DefaultSession, AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "../../../../lib/mongodb"
import { compare } from "bcrypt"
import { User } from "../../../../models/User"
import { Adapter } from "next-auth/adapters"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      avatar?: string
    } & DefaultSession["user"]
  }
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // diğer alanları da ekleyebiliriz
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email ve şifre gerekli')
        }

        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('Kullanıcı bulunamadı')
        }

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error('Geçersiz şifre')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.avatar = user.avatar
      }

      // Handle updates from session callback
      if (trigger === "update" && session?.avatar) {
        token.avatar = session.avatar
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string | undefined
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Google ile giriş yapıldığında özel işlemler
        return true
      }
      return true
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/signin'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
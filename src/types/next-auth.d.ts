import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      avatar?: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: string
    avatar?: string
  }

  interface JWT {
    id: string
    role: string
    avatar?: string
  }
} 
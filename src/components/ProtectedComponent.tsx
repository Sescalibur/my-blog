'use client'

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function ProtectedComponent() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin')
    }
  })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return <div>Protected Content for {session.user.email}</div>
} 
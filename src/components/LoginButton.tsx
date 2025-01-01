'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        {session.user?.name} olarak giriş yaptınız
        <button onClick={() => signOut()}>Çıkış Yap</button>
      </div>
    )
  }
  return <button onClick={() => signIn()}>Giriş Yap</button>
} 
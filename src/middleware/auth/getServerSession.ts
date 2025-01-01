import { getServerSession as getNextAuthServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getServerSession() {
  const session = await getNextAuthServerSession(authOptions)
  return session
} 
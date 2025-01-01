export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: 'test-user-id',
          role: 'user'
        }
      }
    }
  }
} 
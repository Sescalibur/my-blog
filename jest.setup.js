// Increase timeout for all tests
jest.setTimeout(30000)

// Set up manual mocks
jest.mock('next-auth/next')
jest.mock('@auth/mongodb-adapter')
jest.mock('./src/app/api/auth/[...nextauth]/route.ts', () => ({
  authOptions: {
    session: { strategy: 'jwt' },
    callbacks: {
      async session({ session, token }) {
        return session
      },
      async jwt({ token, user }) {
        return token
      }
    }
  }
})) 
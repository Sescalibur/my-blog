'use client'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        themes={['light', 'dark', 'nature', 'neon']}
      >
        {children}
        <Toaster 
          position="top-right"
          expand={false}
          richColors
        />
      </ThemeProvider>
    </SessionProvider>
  )
} 
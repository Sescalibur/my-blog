'use client'

import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Chrome } from 'lucide-react'
import { useState } from 'react'

interface LoginButtonProps {
  provider: 'google'
  className?: string
}

export function LoginButton({ provider, className }: LoginButtonProps) {
  const t = useTranslations('Auth')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      await signIn(provider, { callbackUrl: '/profile' })
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      ) : (
        <Chrome className="w-5 h-5" />
      )}
      {t('continueWith', { provider: 'Google' })}
    </button>
  )
} 
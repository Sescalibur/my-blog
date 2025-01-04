'use client'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from './ThemeSwitcher'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()
  const t = useTranslations('Navbar')

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('home')}
            </Link>
            <Link 
              href="/blog" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('blog')}
            </Link>
            {session && (
              <Link 
                href="/blog/new" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                {t('newPost')}
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span>{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground"
              >
                {t('signOut')}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-muted-foreground hover:text-foreground"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                {t('signUp')}
              </Link>
            </>
          )}
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
    </motion.header>
  )
} 
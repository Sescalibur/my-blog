'use client'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from './ThemeSwitcher'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export function Navbar() {
  const { data: session } = useSession()
  const t = useTranslations('Navbar')
  //console.log(session)
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
              <Link
                href="/profile"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                {session.user.avatar ? (
                  <Image
                    src={session.user.avatar}
                    alt={session.user.name || ''}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {session.user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span>{session.user.name}</span>
              </Link>
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
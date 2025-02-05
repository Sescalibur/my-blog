'use client'
import { motion } from 'framer-motion'
import { ThemeSwitcher } from './ThemeSwitcher'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const t = useTranslations('Navbar')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/blog', label: t('blog') },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
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
            <div className="hidden md:flex items-center gap-4">
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
            </div>

            <ThemeSwitcher />
            <LanguageSwitcher />

            <button
              className="md:hidden p-2 hover:bg-accent rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pt-4 pb-2 space-y-4"
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {session.user.name}
                </Link>
                <Link
                  href="/blog/new"
                  className="block py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('newPost')}
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-muted-foreground hover:text-foreground"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('signUp')}
                </Link>
              </>
            )}
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
} 
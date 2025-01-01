'use client'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Globe } from 'lucide-react'

const locales = ['en', 'tr', 'es', 'de']

export function LanguageSwitcher() {
  const router = useRouter()

  const switchLocale = (locale: string) => {
    router.push(`/${locale}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:bg-accent rounded-md">
        <Globe className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border rounded-md shadow-lg p-2">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-sm cursor-pointer"
          >
            {locale.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
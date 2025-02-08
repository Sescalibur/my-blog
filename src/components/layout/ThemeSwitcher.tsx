'use client'
import { useTheme } from 'next-themes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Sun, Moon, Leaf, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const themes = [
  { name: 'light', icon: Sun },
  { name: 'dark', icon: Moon },
  { name: 'nature', icon: Leaf },
  { name: 'neon', icon: Zap }
]

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    //console.log('Current theme:', theme)
    //console.log('Resolved theme:', resolvedTheme)
  }, [theme, resolvedTheme])

  if (!mounted) {
    return null
  }

  const currentTheme = themes.find(t => t.name === theme)
  const Icon = currentTheme?.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 hover:bg-accent rounded-md">
        {Icon && <Icon className="w-5 h-5" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border rounded-md shadow-lg p-2">
        {themes.map(({ name, icon: Icon }) => (
          <DropdownMenuItem
            key={name}
            onClick={() => {
              //console.log('Changing theme to:', name);
              setTheme(name);
            }}

            className={`flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-sm cursor-pointer
              ${theme === name ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon className="w-4 h-4" />
            <span className="capitalize">{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
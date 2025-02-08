'use client'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProfileImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  isCover?: boolean
}

export function ProfileImage({ 
  src, 
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  isCover = false
}: ProfileImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn(
      'overflow-hidden',
      isLoading ? 'animate-pulse bg-muted' : '',
      isCover ? 'absolute inset-0 aspect-[3/1]' : '',
      className
    )}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0',
          isCover ? 'object-cover' : 'object-cover'
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  )
} 
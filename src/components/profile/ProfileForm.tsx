'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AvatarUpload } from '../AvatarUpload'
import { CoverUpload } from '../CoverUpload'
import { useSession } from 'next-auth/react'
import { Twitter, Github, Linkedin, Globe } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormProps {
  user: {
    name: string
    email: string
    avatar?: string
    coverImage?: string
    bio?: string
    socialLinks?: {
      twitter?: string
      github?: string
      linkedin?: string
      website?: string
    }
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations('Profile')
  const { data: session, update: updateSession } = useSession()
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio ?? '',
    avatar: user.avatar ?? '',
    coverImage: user.coverImage ?? '',
    socialLinks: {
      twitter: user.socialLinks?.twitter ?? '',
      github: user.socialLinks?.github ?? '',
      linkedin: user.socialLinks?.linkedin ?? '',
      website: user.socialLinks?.website ?? ''
    }
  })
  const [avatarUrl, setAvatarUrl] = useState(user.avatar ?? '')
  const [coverUrl, setCoverUrl] = useState(user.coverImage ?? '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url)
    setFormData(prev => ({ ...prev, avatar: url }))
  }

  const handleCoverUpload = (url: string) => {
    setCoverUrl(url)
    setFormData(prev => ({ ...prev, coverImage: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    const loadingToast = toast.loading(t('updating'))

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          avatar: formData.avatar,
          coverImage: formData.coverImage,
          socialLinks: formData.socialLinks
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || t('error'))
      }

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          avatar: formData.avatar
        }
      })

      toast.success(t('updateSuccess'), { id: loadingToast })
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('coverImage')}
          </label>
          <CoverUpload 
            currentImage={coverUrl}
            onUpload={handleCoverUpload}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('avatar')}
          </label>
          <AvatarUpload 
            currentImage={avatarUrl}
            onUpload={handleAvatarUpload}
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            {t('name')}
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-2">
            {t('bio')}
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full rounded-md border p-2 min-h-[100px]"
            maxLength={500}
            placeholder={t('bioPlaceholder')}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">{t('socialLinks')}</h3>
          
          <div className="flex items-center gap-2">
            <Twitter className="w-5 h-5 text-muted-foreground" />
            <input
              type="url"
              value={formData.socialLinks.twitter}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, twitter: e.target.value }
              }))}
              className="flex-1 rounded-md border p-2"
              placeholder="Twitter URL"
            />
          </div>

          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-muted-foreground" />
            <input
              type="url"
              value={formData.socialLinks.github}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, github: e.target.value }
              }))}
              className="flex-1 rounded-md border p-2"
              placeholder="GitHub URL"
            />
          </div>

          <div className="flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-muted-foreground" />
            <input
              type="url"
              value={formData.socialLinks.linkedin}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
              }))}
              className="flex-1 rounded-md border p-2"
              placeholder="LinkedIn URL"
            />
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <input
              type="url"
              value={formData.socialLinks.website}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, website: e.target.value }
              }))}
              className="flex-1 rounded-md border p-2"
              placeholder={t('websitePlaceholder')}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? t('updating') : t('update')}
      </button>
    </form>
  )
} 
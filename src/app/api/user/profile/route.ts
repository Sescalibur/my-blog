import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { User } from "@/models/User"
import { z } from 'zod'
import dbConnect from '@/lib/mongoose'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  socialLinks: z.object({
    twitter: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal(''))
  }).optional()
})

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await dbConnect()
    const body = await req.json()
    const validatedData = updateProfileSchema.parse(body)

    const cleanSocialLinks = validatedData.socialLinks ? 
      Object.fromEntries(
        Object.entries(validatedData.socialLinks).map(([key, value]) => [
          key, 
          value === '' ? undefined : value
        ])
      ) : {}

    const updateData = {
      name: validatedData.name,
      bio: validatedData.bio || null,
      avatar: validatedData.avatar || null,
      coverImage: validatedData.coverImage || null,
      socialLinks: cleanSocialLinks
    }

    console.log('MongoDB Update Query:', {
      userId: session.user.id,
      updateData: JSON.stringify(updateData, null, 2)
    });

    const currentUser = await User.findById(session.user.id).lean();
    console.log('Current User:', JSON.stringify(currentUser, null, 2));

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { 
        new: true,
        runValidators: true,
        overwrite: false
      }
    ).select('-password').lean()

    console.log('Updated User:', JSON.stringify(updatedUser, null, 2));

    if (!updatedUser) {
      return new Response('User not found', { status: 404 })
    }

    const serializedUser = {
      ...updatedUser,
      _id: updatedUser._id.toString(),
      createdAt: updatedUser.createdAt?.toISOString(),
      updatedAt: updatedUser.updatedAt?.toISOString()
    }

    return new Response(JSON.stringify(serializedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Failed to update profile:', error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response('Error updating profile', { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await dbConnect()
    const user = await User.findById(session.user.id)
      .select('-password')
      .lean()

    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    const serializedUser = {
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    }

    return NextResponse.json(serializedUser, {
      headers: {
        'Cache-Control': 'private, s-maxage=60'
      }
    })
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return new Response('Error fetching profile', { status: 500 })
  }
} 
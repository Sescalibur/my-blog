import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot exceed 10000 characters')
})

export type CreatePostInput = z.infer<typeof createPostSchema> 

export const updatePostSchema = createPostSchema.partial()

export const postIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID')
}) 
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { getSession } from '~/server/better-auth/server'
import { db } from '~/server/db'
import { tryCatch } from '~/utils/try-catch'

const CreatePostSchema = z.object({ name: z.string().min(1) })

export type CreatePostState = { success: boolean; error?: string }

export const createPost = async (_prevState: CreatePostState, formData: FormData): Promise<CreatePostState> => {
  const session = await getSession()

  if (!session?.user) {
    return { success: false, error: 'Unauthorized' }
  }

  const parsed = CreatePostSchema.safeParse({ name: formData.get('name') })

  if (!parsed.success) {
    return { success: false, error: 'Post title cannot be empty.' }
  }

  const { error } = await tryCatch(
    db.post.create({
      data: {
        name: parsed.data.name,
        createdBy: { connect: { id: session.user.id } },
      },
    })
  )

  if (error) {
    return { success: false, error: 'Failed to create post.' }
  }

  revalidatePath('/')
  return { success: true }
}

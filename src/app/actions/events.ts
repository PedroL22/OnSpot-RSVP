'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getSession } from '~/server/better-auth/server'
import { db } from '~/server/db'
import { withServerAction } from '~/server/observability/server-action'
import { createEventSchema } from '~/server/validation/events'
import { tryCatch } from '~/utils/try-catch'

import type { ActionState } from './types'

const createValidationErrorState = (fieldErrors: ActionState['fieldErrors']): ActionState => ({
  fieldErrors,
  message: 'Please fix the highlighted fields and try again.',
  success: false,
})

export const createEvent = withServerAction(
  'create_event',
  async (context, _prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const session = await getSession()

    if (!session?.user) {
      return {
        message: 'You must sign in to create an event.',
        success: false,
      }
    }

    context.observe.setAttributes({
      'user.id': session.user.id,
    })

    const parsed = createEventSchema.safeParse({
      capacity: formData.get('capacity')?.toString(),
      description: formData.get('description'),
      location: formData.get('location'),
      startsAt: formData.get('startsAt'),
      startsAtOffsetMinutes: formData.get('startsAtOffsetMinutes'),
      title: formData.get('title'),
    })

    if (!parsed.success) {
      return createValidationErrorState(parsed.error.flatten().fieldErrors)
    }

    const { data: event, error } = await tryCatch(
      db.event.create({
        data: {
          capacity: parsed.data.capacity,
          description: parsed.data.description,
          location: parsed.data.location,
          organizerId: session.user.id,
          startsAt: parsed.data.startsAt,
          startsAtOffsetMinutes: parsed.data.startsAtOffsetMinutes,
          title: parsed.data.title,
        },
      })
    )

    if (error) {
      return {
        message: 'Unable to create the event right now.',
        success: false,
      }
    }

    context.observe.setAttributes({
      'event.id': event.id,
      'event.publicId': event.publicId,
      success: true,
    })

    revalidatePath('/dashboard')
    redirect(`/dashboard/events/${event.id}`)
  }
)

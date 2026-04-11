'use server'

import { Prisma, type RsvpStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { getSession } from '~/server/better-auth/server'
import { db } from '~/server/db'
import { withServerAction } from '~/server/observability/server-action'
import { hasAvailableCapacity } from '~/server/queries/rsvps'
import { checkInSchema, createRsvpSchema, promoteWaitlistSchema } from '~/server/validation/rsvps'
import { tryCatch } from '~/utils/try-catch'

import type { ActionState } from './types'

export type CreateRsvpState = ActionState & {
  rsvpStatus?: RsvpStatus
}

export const initialCreateRsvpState: CreateRsvpState = {
  success: false,
}

const createValidationErrorState = (fieldErrors: ActionState['fieldErrors']): ActionState => ({
  fieldErrors,
  message: 'Please fix the highlighted fields and try again.',
  success: false,
})

const createRsvpValidationErrorState = (fieldErrors: ActionState['fieldErrors']): CreateRsvpState => ({
  fieldErrors,
  message: 'Please fix the highlighted fields and try again.',
  success: false,
})

const isKnownPrismaError = (error: unknown, code: string) => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
}

export const createRsvp = withServerAction(
  'create_rsvp',
  async (context, _prevState: CreateRsvpState, formData: FormData): Promise<CreateRsvpState> => {
    const parsed = createRsvpSchema.safeParse({
      email: formData.get('email'),
      eventPublicId: formData.get('eventPublicId'),
      name: formData.get('name'),
    })

    if (!parsed.success) {
      return createRsvpValidationErrorState(parsed.error.flatten().fieldErrors)
    }

    context.observe.setAttributes({
      'event.publicId': parsed.data.eventPublicId,
      'guest.email': parsed.data.email,
      'guest.name': parsed.data.name,
    })

    const { data: result, error } = await tryCatch(
      db.$transaction(
        async (tx) => {
          const event = await tx.event.findUnique({
            select: {
              capacity: true,
              id: true,
              publicId: true,
            },
            where: {
              publicId: parsed.data.eventPublicId,
            },
          })

          if (!event) {
            return {
              kind: 'missing-event',
            } as const
          }

          const existingRsvp = await tx.rsvp.findUnique({
            select: {
              id: true,
              status: true,
            },
            where: {
              eventId_email: {
                email: parsed.data.email,
                eventId: event.id,
              },
            },
          })

          if (existingRsvp) {
            return {
              kind: 'duplicate',
            } as const
          }

          const confirmedCount = await tx.rsvp.count({
            where: {
              eventId: event.id,
              status: 'CONFIRMED',
            },
          })

          const nextStatus: RsvpStatus = hasAvailableCapacity(event.capacity, confirmedCount)
            ? 'CONFIRMED'
            : 'WAITLISTED'

          const rsvp = await tx.rsvp.create({
            data: {
              email: parsed.data.email,
              eventId: event.id,
              name: parsed.data.name,
              status: nextStatus,
            },
          })

          await tx.eventActivity.create({
            data: {
              actorType: 'GUEST',
              eventId: event.id,
              message:
                nextStatus === 'CONFIRMED'
                  ? `${parsed.data.name} RSVP'd and is confirmed.`
                  : `${parsed.data.name} joined the waitlist.`,
              metadata: {
                email: parsed.data.email,
              },
              rsvpId: rsvp.id,
              type: nextStatus === 'CONFIRMED' ? 'RSVP_CREATED' : 'RSVP_WAITLISTED',
            },
          })

          return {
            eventId: event.id,
            eventPublicId: event.publicId,
            kind: 'created',
            rsvpId: rsvp.id,
            status: nextStatus,
          } as const
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      )
    )

    if (isKnownPrismaError(error, 'P2002')) {
      return {
        message: "This email has already RSVP'd for this event.",
        success: false,
      }
    }

    if (error) {
      return {
        message: 'Unable to submit your RSVP right now.',
        success: false,
      }
    }

    if (result.kind === 'missing-event') {
      return {
        message: 'This event is no longer available.',
        success: false,
      }
    }

    if (result.kind === 'duplicate') {
      return {
        message: "This email has already RSVP'd for this event.",
        success: false,
      }
    }

    context.observe.setAttributes({
      'event.id': result.eventId,
      'rsvp.id': result.rsvpId,
      'rsvp.status': result.status,
      success: true,
    })

    revalidatePath(`/dashboard/events/${result.eventId}`)
    revalidatePath('/dashboard')
    revalidatePath(`/r/${result.eventPublicId}`)

    return {
      message: result.status === 'CONFIRMED' ? "You're confirmed." : "You're on the waitlist.",
      rsvpStatus: result.status,
      success: true,
    }
  }
)

export const markRsvpCheckedIn = withServerAction(
  'mark_rsvp_checked_in',
  async (context, eventId: string, rsvpId: string): Promise<ActionState> => {
    const session = await getSession()

    if (!session?.user) {
      return {
        message: 'You must sign in to check guests in.',
        success: false,
      }
    }

    context.observe.setAttributes({
      'rsvp.id': rsvpId,
      'event.id': eventId,
      'user.id': session.user.id,
    })

    const parsed = checkInSchema.safeParse({ eventId, rsvpId })

    if (!parsed.success) {
      return createValidationErrorState(parsed.error.flatten().fieldErrors)
    }

    const { data: result, error } = await tryCatch(
      db.$transaction(
        async (tx) => {
          const event = await tx.event.findFirst({
            select: {
              id: true,
              publicId: true,
            },
            where: {
              id: parsed.data.eventId,
              organizerId: session.user.id,
            },
          })

          if (!event) {
            return {
              kind: 'missing-event',
            } as const
          }

          const rsvp = await tx.rsvp.findFirst({
            select: {
              checkedInAt: true,
              id: true,
              name: true,
              status: true,
            },
            where: {
              eventId: event.id,
              id: parsed.data.rsvpId,
            },
          })

          if (!rsvp) {
            return {
              kind: 'missing-rsvp',
            } as const
          }

          const checkedInAt = new Date()

          const checkedInRsvp = await tx.rsvp.updateMany({
            data: {
              checkedInAt,
            },
            where: {
              checkedInAt: null,
              eventId: event.id,
              id: rsvp.id,
              status: 'CONFIRMED',
            },
          })

          if (checkedInRsvp.count === 0) {
            if (rsvp.status !== 'CONFIRMED') {
              return {
                kind: 'waitlisted',
              } as const
            }

            return {
              kind: 'already-checked-in',
            } as const
          }

          await tx.eventActivity.create({
            data: {
              actorType: 'ORGANIZER',
              actorUserId: session.user.id,
              eventId: event.id,
              message: `${rsvp.name} was checked in.`,
              rsvpId: rsvp.id,
              type: 'RSVP_CHECKED_IN',
            },
          })

          return {
            eventId: event.id,
            eventPublicId: event.publicId,
            kind: 'checked-in',
            rsvpId: rsvp.id,
          } as const
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      )
    )

    if (error) {
      return {
        message: 'Unable to check that guest in right now.',
        success: false,
      }
    }

    if (result.kind === 'missing-event' || result.kind === 'missing-rsvp') {
      return {
        message: 'That RSVP could not be found.',
        success: false,
      }
    }

    if (result.kind === 'waitlisted') {
      return {
        message: 'Waitlisted guests cannot be checked in.',
        success: false,
      }
    }

    if (result.kind === 'already-checked-in') {
      return {
        message: 'That guest has already been checked in.',
        success: false,
      }
    }

    context.observe.setAttributes({
      success: true,
    })

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/events/${result.eventId}`)
    revalidatePath(`/r/${result.eventPublicId}`)

    return {
      message: 'Guest checked in.',
      success: true,
    }
  }
)

export const promoteWaitlistedRsvp = withServerAction(
  'promote_waitlisted_rsvp',
  async (context, eventId: string, rsvpId: string): Promise<ActionState> => {
    const session = await getSession()

    if (!session?.user) {
      return {
        message: 'You must sign in to manage the waitlist.',
        success: false,
      }
    }

    context.observe.setAttributes({
      'event.id': eventId,
      'rsvp.id': rsvpId,
      'user.id': session.user.id,
    })

    const parsed = promoteWaitlistSchema.safeParse({ eventId, rsvpId })

    if (!parsed.success) {
      return createValidationErrorState(parsed.error.flatten().fieldErrors)
    }

    const { data: result, error } = await tryCatch(
      db.$transaction(
        async (tx) => {
          const event = await tx.event.findFirst({
            select: {
              capacity: true,
              id: true,
              publicId: true,
            },
            where: {
              id: parsed.data.eventId,
              organizerId: session.user.id,
            },
          })

          if (!event) {
            return {
              kind: 'missing-event',
            } as const
          }

          const rsvp = await tx.rsvp.findFirst({
            select: {
              id: true,
              name: true,
              status: true,
            },
            where: {
              eventId: event.id,
              id: parsed.data.rsvpId,
            },
          })

          if (!rsvp) {
            return {
              kind: 'missing-rsvp',
            } as const
          }

          if (rsvp.status !== 'WAITLISTED') {
            return {
              kind: 'already-confirmed',
            } as const
          }

          const confirmedCount = await tx.rsvp.count({
            where: {
              eventId: event.id,
              status: 'CONFIRMED',
            },
          })

          if (!hasAvailableCapacity(event.capacity, confirmedCount)) {
            return {
              kind: 'full',
            } as const
          }

          const promotedRsvp = await tx.rsvp.updateMany({
            data: {
              status: 'CONFIRMED',
            },
            where: {
              eventId: event.id,
              id: rsvp.id,
              status: 'WAITLISTED',
            },
          })

          if (promotedRsvp.count === 0) {
            return {
              kind: 'already-confirmed',
            } as const
          }

          await tx.eventActivity.create({
            data: {
              actorType: 'ORGANIZER',
              actorUserId: session.user.id,
              eventId: event.id,
              message: `${rsvp.name} was promoted from the waitlist.`,
              rsvpId: rsvp.id,
              type: 'RSVP_PROMOTED',
            },
          })

          return {
            eventId: event.id,
            eventPublicId: event.publicId,
            kind: 'promoted',
            rsvpId: rsvp.id,
          } as const
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      )
    )

    if (isKnownPrismaError(error, 'P2034')) {
      return {
        message: 'No confirmed spots are available right now.',
        success: false,
      }
    }

    if (error) {
      return {
        message: 'Unable to promote that guest right now.',
        success: false,
      }
    }

    if (result.kind === 'missing-event' || result.kind === 'missing-rsvp') {
      return {
        message: 'That RSVP could not be found.',
        success: false,
      }
    }

    if (result.kind === 'already-confirmed') {
      return {
        message: 'That RSVP is already confirmed.',
        success: false,
      }
    }

    if (result.kind === 'full') {
      return {
        message: 'No confirmed spots are available right now.',
        success: false,
      }
    }

    context.observe.setAttributes({
      success: true,
    })

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/events/${result.eventId}`)
    revalidatePath(`/r/${result.eventPublicId}`)

    return {
      message: 'Guest moved from the waitlist.',
      success: true,
    }
  }
)

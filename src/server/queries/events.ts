import { db } from '~/server/db'
import { tryCatch } from '~/utils/try-catch'

import { summarizeRsvps } from './rsvps'

export const getOrganizerEvents = async (userId: string) => {
  const { data: events, error } = await tryCatch(
    db.event.findMany({
      orderBy: [{ startsAt: 'asc' }, { createdAt: 'desc' }],
      select: {
        capacity: true,
        id: true,
        location: true,
        publicId: true,
        rsvps: {
          orderBy: { createdAt: 'asc' },
          select: {
            checkedInAt: true,
            status: true,
          },
        },
        startsAt: true,
        startsAtOffsetMinutes: true,
        title: true,
      },
      where: {
        organizerId: userId,
      },
    })
  )

  if (error) {
    throw error
  }

  return events.map((event) => ({
    ...summarizeRsvps(event.rsvps, event.capacity),
    capacity: event.capacity,
    id: event.id,
    location: event.location,
    publicId: event.publicId,
    startsAt: event.startsAt,
    startsAtOffsetMinutes: event.startsAtOffsetMinutes,
    title: event.title,
  }))
}

export const getOrganizerEventDetail = async (eventId: string, userId: string) => {
  const { data: event, error } = await tryCatch(
    db.event.findFirst({
      select: {
        activities: {
          orderBy: { createdAt: 'desc' },
          select: {
            actorType: true,
            actorUser: {
              select: {
                name: true,
              },
            },
            createdAt: true,
            id: true,
            message: true,
            metadata: true,
            type: true,
          },
          take: 20,
        },
        capacity: true,
        description: true,
        id: true,
        location: true,
        publicId: true,
        rsvps: {
          orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
          select: {
            checkedInAt: true,
            createdAt: true,
            email: true,
            id: true,
            name: true,
            status: true,
          },
        },
        startsAt: true,
        startsAtOffsetMinutes: true,
        title: true,
      },
      where: {
        id: eventId,
        organizerId: userId,
      },
    })
  )

  if (error) {
    throw error
  }

  if (!event) {
    return null
  }

  return {
    ...event,
    ...summarizeRsvps(event.rsvps, event.capacity),
  }
}

export const getPublicEvent = async (publicId: string) => {
  const { data: event, error } = await tryCatch(
    db.event.findUnique({
      select: {
        capacity: true,
        description: true,
        id: true,
        location: true,
        publicId: true,
        rsvps: {
          select: {
            checkedInAt: true,
            status: true,
          },
        },
        startsAt: true,
        startsAtOffsetMinutes: true,
        title: true,
      },
      where: {
        publicId,
      },
    })
  )

  if (error) {
    throw error
  }

  if (!event) {
    return null
  }

  return {
    ...event,
    ...summarizeRsvps(event.rsvps, event.capacity),
  }
}

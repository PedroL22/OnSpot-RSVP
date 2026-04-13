import 'dotenv/config'

import { auth } from '../src/server/better-auth'
import { db } from '../src/server/db'

import type { EventActivityType, RsvpStatus } from '@prisma/client'

const DEMO_EMAIL = 'organizer@onspot.app'
const DEMO_PASSWORD = 'OnspotDemo123!'
const DEMO_NAME = 'OnSpot Demo Organizer'

const guestNames = [
  'Alex Morgan',
  'Jordan Lee',
  'Taylor Brooks',
  'Riley Chen',
  'Sam Carter',
  'Casey Patel',
  'Jamie Rivera',
  'Avery Wilson',
  'Parker Kim',
  'Reese Johnson',
  'Cameron Davis',
  'Logan Garcia',
  'Elliot Brown',
  'Quinn Martin',
  'Drew Thompson',
  'Sydney Clark',
  'Rowan Lewis',
  'Morgan Walker',
  'Hayden Young',
  'Charlie Scott',
]

type SeedEvent = {
  capacity: number | null
  checkedInCount: number
  confirmedCount: number
  description: string
  location: string
  startsAt: Date
  startsAtOffsetMinutes: number
  title: string
  waitlistedCount: number
}

const eventsToSeed: SeedEvent[] = [
  {
    capacity: null,
    checkedInCount: 3,
    confirmedCount: 14,
    description: 'An unlimited breakfast gathering for founders, partners, and the early crew.',
    location: 'Solar Cafe, Aldeota',
    startsAt: new Date('2026-04-06T09:00:00-03:00'),
    startsAtOffsetMinutes: 180,
    title: 'Founders Breakfast',
    waitlistedCount: 0,
  },
  {
    capacity: 16,
    checkedInCount: 2,
    confirmedCount: 12,
    description: 'A product demo night with an active waitlist and open spots for manual promotion.',
    location: 'Casa Oito, Meireles',
    startsAt: new Date('2026-04-14T19:30:00-03:00'),
    startsAtOffsetMinutes: 180,
    title: 'Product Demo Night',
    waitlistedCount: 3,
  },
  {
    capacity: 12,
    checkedInCount: 1,
    confirmedCount: 12,
    description: 'A fully booked afterparty where new guests should land on the waitlist immediately.',
    location: 'Cobertura Vista Mar, Praia de Iracema',
    startsAt: new Date('2026-04-21T20:00:00-03:00'),
    startsAtOffsetMinutes: 180,
    title: 'Rooftop Afterparty',
    waitlistedCount: 4,
  },
]

const buildEmail = (eventIndex: number, guestIndex: number) => {
  return `guest-${eventIndex + 1}-${guestIndex + 1}@onspot.app`
}

const resetDemoUser = async () => {
  await db.user.deleteMany({
    where: {
      email: DEMO_EMAIL,
    },
  })
}

const ensureDemoUser = async () => {
  await auth.api.signUpEmail({
    body: {
      callbackURL: '/dashboard',
      email: DEMO_EMAIL,
      name: DEMO_NAME,
      password: DEMO_PASSWORD,
    },
  })

  const user = await db.user.findUnique({
    where: {
      email: DEMO_EMAIL,
    },
  })

  if (!user) {
    throw new Error('Unable to create demo organizer.')
  }

  return user
}

const createActivity = async ({
  actorType,
  actorUserId,
  createdAt,
  eventId,
  message,
  rsvpId,
  type,
}: {
  actorType: 'GUEST' | 'ORGANIZER'
  actorUserId?: string
  createdAt: Date
  eventId: string
  message: string
  rsvpId: string
  type: EventActivityType
}) => {
  await db.eventActivity.create({
    data: {
      actorType,
      actorUserId,
      createdAt,
      eventId,
      message,
      rsvpId,
      type,
    },
  })
}

const seedEvent = async (organizerId: string, seedEventInput: SeedEvent, eventIndex: number) => {
  const event = await db.event.create({
    data: {
      capacity: seedEventInput.capacity,
      description: seedEventInput.description,
      location: seedEventInput.location,
      organizerId,
      startsAt: seedEventInput.startsAt,
      startsAtOffsetMinutes: seedEventInput.startsAtOffsetMinutes,
      title: seedEventInput.title,
    },
  })

  const totalGuests = seedEventInput.confirmedCount + seedEventInput.waitlistedCount

  for (let guestIndex = 0; guestIndex < totalGuests; guestIndex += 1) {
    const guestName = guestNames[(eventIndex * 7 + guestIndex) % guestNames.length] ?? `Guest ${guestIndex + 1}`
    const createdAt = new Date(seedEventInput.startsAt.getTime() - (totalGuests - guestIndex) * 86_400_000)
    const status: RsvpStatus = guestIndex < seedEventInput.confirmedCount ? 'CONFIRMED' : 'WAITLISTED'
    const shouldCheckIn = status === 'CONFIRMED' && guestIndex < seedEventInput.checkedInCount
    const checkedInAt = shouldCheckIn ? new Date(seedEventInput.startsAt.getTime() - (guestIndex + 1) * 600_000) : null

    const rsvp = await db.rsvp.create({
      data: {
        checkedInAt,
        createdAt,
        email: buildEmail(eventIndex, guestIndex),
        eventId: event.id,
        name: guestName,
        status,
      },
    })

    await createActivity({
      actorType: 'GUEST',
      createdAt,
      eventId: event.id,
      message: status === 'CONFIRMED' ? `${guestName} RSVP'd and is confirmed.` : `${guestName} joined the waitlist.`,
      rsvpId: rsvp.id,
      type: status === 'CONFIRMED' ? 'RSVP_CREATED' : 'RSVP_WAITLISTED',
    })

    if (checkedInAt) {
      await createActivity({
        actorType: 'ORGANIZER',
        actorUserId: organizerId,
        createdAt: checkedInAt,
        eventId: event.id,
        message: `${guestName} was checked in.`,
        rsvpId: rsvp.id,
        type: 'RSVP_CHECKED_IN',
      })
    }
  }
}

const main = async () => {
  await resetDemoUser()
  const demoUser = await ensureDemoUser()

  for (let eventIndex = 0; eventIndex < eventsToSeed.length; eventIndex += 1) {
    const event = eventsToSeed[eventIndex]

    if (!event) {
      continue
    }

    await seedEvent(demoUser.id, event, eventIndex)
  }

  process.stdout.write(`Seeded demo organizer: ${DEMO_EMAIL}\n`)
}

void main()
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })

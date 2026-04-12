import type { RsvpStatus } from '@prisma/client'

type RsvpSummarySource = {
  checkedInAt: Date | null
  status: RsvpStatus
}

type RsvpSummary = {
  checkedInCount: number
  confirmedCount: number
  remainingCapacity: number | null
  totalCount: number
  waitlistedCount: number
}

export const summarizeRsvps = (rsvps: RsvpSummarySource[], capacity: number | null): RsvpSummary => {
  const confirmedCount = rsvps.filter((rsvp) => rsvp.status === 'CONFIRMED').length
  const waitlistedCount = rsvps.filter((rsvp) => rsvp.status === 'WAITLISTED').length
  const checkedInCount = rsvps.filter((rsvp) => rsvp.checkedInAt !== null).length

  return {
    checkedInCount,
    confirmedCount,
    remainingCapacity: capacity === null ? null : Math.max(capacity - confirmedCount, 0),
    totalCount: rsvps.length,
    waitlistedCount,
  }
}

export const hasAvailableCapacity = (capacity: number | null, confirmedCount: number) => {
  if (capacity === null) {
    return true
  }

  return confirmedCount < capacity
}

import { z } from 'zod'

export const createRsvpSchema = z.object({
  eventPublicId: z.string().trim().cuid('Invalid event.'),
  name: z.string().trim().min(1, 'Name is required.').max(120, 'Name must be 120 characters or fewer.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Enter a valid email address.')
    .max(320, 'Email must be 320 characters or fewer.'),
})

export const checkInSchema = z.object({
  eventId: z.string().trim().cuid('Invalid event.'),
  rsvpId: z.string().trim().cuid('Invalid RSVP.'),
})

export const promoteWaitlistSchema = z.object({
  eventId: z.string().trim().cuid('Invalid event.'),
  rsvpId: z.string().trim().cuid('Invalid RSVP.'),
})

import { z } from 'zod'

import { isDateTimeLocalValue, parseDateTimeLocalToUtc } from '~/lib/formatters'

export const createEventSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.').max(120, 'Title must be 120 characters or fewer.'),
    description: z
      .string()
      .trim()
      .min(1, 'Description is required.')
      .max(2000, 'Description must be 2000 characters or fewer.'),
    startsAt: z
      .string()
      .trim()
      .min(1, 'Start date and time are required.')
      .refine((value) => isDateTimeLocalValue(value), 'Enter a valid start date and time.'),
    startsAtOffsetMinutes: z
      .string()
      .trim()
      .min(1, 'Time zone offset is required.')
      .transform((value) => Number.parseInt(value, 10))
      .refine((value) => Number.isInteger(value) && value >= -840 && value <= 840, 'Enter a valid time zone offset.'),
    location: z.string().trim().min(1, 'Location is required.').max(200, 'Location must be 200 characters or fewer.'),
    capacity: z
      .string()
      .trim()
      .optional()
      .transform((value) => {
        if (!value) {
          return null
        }

        const parsed = Number.parseInt(value, 10)

        if (Number.isNaN(parsed)) {
          return Number.NaN
        }

        return parsed
      })
      .refine(
        (value) => value === null || (Number.isInteger(value) && value > 0),
        'Capacity must be a positive number.'
      )
      .refine((value) => value === null || value <= 100000, 'Capacity must be 100000 or fewer.'),
  })
  .transform((value) => {
    return {
      ...value,
      startsAt: parseDateTimeLocalToUtc(value.startsAt, value.startsAtOffsetMinutes),
    }
  })

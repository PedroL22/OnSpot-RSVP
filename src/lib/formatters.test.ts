import { describe, expect, it } from 'vitest'

import { formatEventDate, formatUtcOffset, parseDateTimeLocalToUtc } from './formatters'

describe('event date helpers', () => {
  it('parses a local datetime and offset into a stable UTC instant', () => {
    expect(parseDateTimeLocalToUtc('2026-04-12T19:30', 180).toISOString()).toBe('2026-04-12T22:30:00.000Z')
  })

  it('formats event dates with the stored offset instead of the server timezone', () => {
    const formattedDate = formatEventDate(new Date('2026-04-12T22:30:00.000Z'), 180)

    expect(formattedDate).toContain('Apr 12, 2026')
    expect(formattedDate).toContain('7:30 PM')
    expect(formattedDate).toContain('UTC-03:00')
  })

  it('formats UTC offsets using an explicit label', () => {
    expect(formatUtcOffset(180)).toBe('UTC-03:00')
    expect(formatUtcOffset(-120)).toBe('UTC+02:00')
  })
})

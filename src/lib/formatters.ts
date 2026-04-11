const dateTimeLocalPattern =
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2})(?::(?<second>\d{2}))?$/

const eventDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
})

const getShiftedEventDate = (value: Date | string, offsetMinutes: number) => {
  const date = typeof value === 'string' ? new Date(value) : value

  return new Date(date.getTime() - offsetMinutes * 60_000)
}

export const isDateTimeLocalValue = (value: string) => dateTimeLocalPattern.test(value)

export const parseDateTimeLocalToUtc = (value: string, offsetMinutes: number) => {
  const match = dateTimeLocalPattern.exec(value)

  if (!match?.groups) {
    throw new Error('Invalid local date-time value.')
  }

  const { day = '00', hour = '00', minute = '00', month = '00', second = '00', year = '0000' } = match.groups

  const utcTimestamp =
    Date.UTC(
      Number.parseInt(year, 10),
      Number.parseInt(month, 10) - 1,
      Number.parseInt(day, 10),
      Number.parseInt(hour, 10),
      Number.parseInt(minute, 10),
      Number.parseInt(second, 10)
    ) +
    offsetMinutes * 60_000

  return new Date(utcTimestamp)
}

export const formatUtcOffset = (offsetMinutes: number) => {
  const absoluteOffset = Math.abs(offsetMinutes)
  const hours = Math.floor(absoluteOffset / 60)
  const minutes = absoluteOffset % 60
  const sign = offsetMinutes > 0 ? '-' : '+'

  return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const formatEventDate = (value: Date | string, offsetMinutes: number) => {
  const shiftedDate = getShiftedEventDate(value, offsetMinutes)

  return `${eventDateFormatter.format(shiftedDate)} ${formatUtcOffset(offsetMinutes)}`
}

export const toSlug = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

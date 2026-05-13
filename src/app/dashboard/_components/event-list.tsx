import { EventListItem } from './event-list-item'

import { formatEventDate } from '~/lib/formatters'

type EventSummary = {
  capacity: number | null
  checkedInCount: number
  confirmedCount: number
  id: string
  location: string
  publicId: string
  startsAt: Date
  startsAtOffsetMinutes: number
  title: string
  waitlistedCount: number
}

type EventListProps = {
  baseUrl: string
  events: EventSummary[]
  getCapacityPct: (capacity: number | null, confirmedCount: number) => number | null
  getCapacitySummary: (capacity: number | null, confirmedCount: number, waitlistedCount: number) => string | null
}

export const EventList = ({ baseUrl, events, getCapacityPct, getCapacitySummary }: EventListProps) => {
  return (
    <div className='space-y-3'>
      {events.map((event) => {
        const startsAt = event.startsAt

        return (
          <EventListItem
            capacitySummary={getCapacitySummary(event.capacity, event.confirmedCount, event.waitlistedCount)}
            capacityValue={getCapacityPct(event.capacity, event.confirmedCount)}
            checkedInCount={event.checkedInCount}
            confirmedCount={event.confirmedCount}
            dayLabel={startsAt.getDate()}
            href={`/dashboard/events/${event.id}`}
            key={event.id}
            location={event.location}
            monthLabel={startsAt.toLocaleString('en', { month: 'short' }).toUpperCase()}
            shareUrl={new URL(`/r/${event.publicId}`, baseUrl).toString()}
            startsAtLabel={formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
            title={event.title}
            waitlistedCount={event.waitlistedCount}
          />
        )
      })}
    </div>
  )
}

import { notFound, redirect } from 'next/navigation'

import { env } from '~/env'
import { formatEventDate } from '~/lib/formatters'
import { getSession } from '~/server/better-auth/server'
import { getOrganizerEventDetail } from '~/server/queries/events'

import { ActivityFeed } from './_components/activity-feed'
import { EventDetailHero } from './_components/event-detail-hero'
import { EventStatsGrid } from './_components/event-stats-grid'
import { GuestListTable } from './_components/guest-list-table'

type EventDetailPageProps = {
  params: Promise<{ eventId: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const [{ eventId }, session] = await Promise.all([params, getSession()])

  if (!session?.user) {
    redirect('/sign-in?callbackURL=/dashboard')
  }

  const event = await getOrganizerEventDetail(eventId, session.user.id)

  if (!event) {
    notFound()
  }

  const shareUrl = new URL(`/r/${event.publicId}`, env.BETTER_AUTH_URL).toString()
  const capacityPct =
    event.capacity && event.capacity > 0
      ? Math.min(100, Math.round((event.confirmedCount / event.capacity) * 100))
      : null

  const formatDate = (date: Date) => formatEventDate(date, event.startsAtOffsetMinutes)

  return (
    <div className='space-y-6'>
      <section className='grid gap-4 lg:grid-cols-[1fr_280px]'>
        <EventDetailHero
          capacityLabel={event.capacity ? `${event.confirmedCount} / ${event.capacity}` : null}
          capacityValue={capacityPct}
          description={event.description}
          eventId={event.id}
          location={event.location}
          shareUrl={shareUrl}
          startsAtLabel={formatDate(event.startsAt)}
          title={event.title}
        />
        <EventStatsGrid
          checkedInCount={event.checkedInCount}
          confirmedCount={event.confirmedCount}
          remainingCapacity={event.remainingCapacity}
          waitlistedCount={event.waitlistedCount}
        />
      </section>

      <GuestListTable eventId={event.id} formatDate={formatDate} guests={event.rsvps} />

      <ActivityFeed activities={event.activities} formatDate={formatDate} />
    </div>
  )
}

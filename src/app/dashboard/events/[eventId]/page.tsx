import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { buttonVariants } from '~/components/ui/button'
import { ActivityFeed } from './_components/activity-feed'
import { EventDetailHero } from './_components/event-detail-hero'
import { EventStatsGrid } from './_components/event-stats-grid'
import { GuestListTable } from './_components/guest-list-table'

import { env } from '~/env'
import { formatEventDate } from '~/lib/formatters'
import { cn } from '~/lib/utils'
import { getSession } from '~/server/better-auth/server'
import { getOrganizerEventDetail } from '~/server/queries/events'

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
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'ghost' }),
          'w-fit gap-2 font-mono text-[11px] uppercase tracking-[0.16em]'
        )}
        href='/dashboard'
      >
        <CaretLeftIcon data-icon='inline-start' />
        Back to dashboard
      </Link>

      <section className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_128px]'>
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

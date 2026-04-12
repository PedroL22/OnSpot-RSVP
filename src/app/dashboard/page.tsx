import { redirect } from 'next/navigation'

import { RoutePrefetch } from '~/components/navigation/route-prefetch'
import { DashboardPageHeader } from './_components/dashboard-page-header'
import { EventList } from './_components/event-list'
import { EventsEmptyState } from './_components/events-empty-state'

import { env } from '~/env'
import { getSession } from '~/server/better-auth/server'
import { getOrganizerEvents } from '~/server/queries/events'

const getCapacitySummary = (capacity: number | null, confirmedCount: number, waitlistedCount: number) => {
  if (capacity === null) return null
  if (waitlistedCount > 0) return `${confirmedCount}/${capacity} + ${waitlistedCount} waitlist`
  return `${confirmedCount}/${capacity}`
}

const getCapacityPct = (capacity: number | null, confirmedCount: number) => {
  if (capacity === null || capacity === 0) return null
  return Math.min(100, Math.round((confirmedCount / capacity) * 100))
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/sign-in?callbackURL=/dashboard')
  }

  const events = await getOrganizerEvents(session.user.id)
  const prefetchHrefs = ['/dashboard/events/new', ...events.slice(0, 3).map((event) => `/dashboard/events/${event.id}`)]

  return (
    <div className='space-y-8'>
      <RoutePrefetch hrefs={prefetchHrefs} />
      <DashboardPageHeader />

      {events.length === 0 ? (
        <EventsEmptyState />
      ) : (
        <div className='space-y-6'>
          <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]'>
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </p>

          <EventList
            baseUrl={env.BETTER_AUTH_URL}
            events={events}
            getCapacityPct={getCapacityPct}
            getCapacitySummary={getCapacitySummary}
          />
        </div>
      )}
    </div>
  )
}

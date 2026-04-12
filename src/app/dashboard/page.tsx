import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ShareLinkButton } from '~/components/events/share-link-button'

import { env } from '~/env'
import { formatEventDate } from '~/lib/formatters'
import { getSession } from '~/server/better-auth/server'
import { getOrganizerEvents } from '~/server/queries/events'

const getCapacitySummary = (capacity: number | null, confirmedCount: number, waitlistedCount: number) => {
  if (capacity === null) {
    return 'Unlimited'
  }

  if (waitlistedCount > 0) {
    return `${confirmedCount}/${capacity} + ${waitlistedCount} waitlist`
  }

  return `${confirmedCount}/${capacity}`
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/sign-in?callbackURL=/dashboard')
  }

  const events = await getOrganizerEvents(session.user.id)

  return (
    <div className='space-y-8'>
      {/* Hero section */}
      <section className='relative overflow-hidden rounded-2xl bg-ink p-8 lg:p-10'>
        {/* Decorative elements */}
        <div className='diagonal-lines absolute inset-0 opacity-30' />
        <div className='absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-vermillion/20 to-transparent blur-3xl' />

        <div className='relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
          <div className='max-w-2xl space-y-4'>
            <div className='inline-flex items-center gap-2'>
              <span className='h-1.5 w-1.5 rounded-full bg-vermillion' />
              <span className='text-label text-paper/60'>Organizer Dashboard</span>
            </div>

            <h1 className='text-display-lg text-paper'>
              Your events,
              <br />
              <span className='italic'>all in one place</span>
            </h1>

            <p className='max-w-lg text-paper/60 leading-relaxed'>
              Create public RSVP pages, manage guest lists, handle waitlists, and run day-of check-in. Everything an
              organizer needs.
            </p>
          </div>

          <Link
            className='inline-flex items-center justify-center gap-2 rounded-lg bg-vermillion px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-vermillion-dim active:scale-[0.98]'
            href='/dashboard/events/new'
          >
            <svg
              aria-hidden='true'
              className='h-5 w-5'
              fill='none'
              focusable='false'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 4v16m8-8H4' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
            </svg>
            Create event
          </Link>
        </div>
      </section>

      {/* Events grid or empty state */}
      {events.length === 0 ? (
        <section className='card border-dashed p-10'>
          <div className='mx-auto max-w-md space-y-6 text-center'>
            {/* Empty state illustration */}
            <div className='inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-sunken'>
              <svg
                aria-hidden='true'
                className='h-8 w-8 text-ink-subtle'
                fill='none'
                focusable='false'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                />
              </svg>
            </div>

            <div className='space-y-2'>
              <h2 className='text-display-md'>No events yet</h2>
              <p className='text-ink-subtle leading-relaxed'>
                Create your first event and start collecting RSVPs. A shareable page is generated automatically.
              </p>
            </div>

            <Link className='btn-primary inline-flex' href='/dashboard/events/new'>
              Create your first event
              <svg
                aria-hidden='true'
                className='h-4 w-4'
                fill='none'
                focusable='false'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M17 8l4 4m0 0l-4 4m4-4H3' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
              </svg>
            </Link>
          </div>
        </section>
      ) : (
        <section className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-label'>Your Events ({events.length})</h2>
          </div>

          <div className='grid gap-4 lg:grid-cols-2'>
            {events.map((event, index) => {
              const shareUrl = new URL(`/r/${event.publicId}`, env.BETTER_AUTH_URL).toString()

              return (
                <article
                  className='card hover-lift animate-fade-up p-6'
                  key={event.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Event header */}
                  <div className='mb-6 flex items-start justify-between gap-4'>
                    <div className='min-w-0 space-y-2'>
                      <p className='text-label text-vermillion'>
                        {formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
                      </p>
                      <Link
                        className='block truncate font-serif text-2xl text-ink transition-colors hover:text-vermillion'
                        href={`/dashboard/events/${event.id}`}
                      >
                        {event.title}
                      </Link>
                      <p className='truncate text-ink-subtle text-sm'>{event.location}</p>
                    </div>

                    <ShareLinkButton shareUrl={shareUrl} />
                  </div>

                  {/* Stats grid */}
                  <div className='grid grid-cols-4 gap-3'>
                    <div className='stat-block'>
                      <p className='stat-label'>Confirmed</p>
                      <p className='stat-value text-2xl'>{event.confirmedCount}</p>
                    </div>
                    <div className='stat-block'>
                      <p className='stat-label'>Checked in</p>
                      <p className='stat-value text-2xl'>{event.checkedInCount}</p>
                    </div>
                    <div className='stat-block'>
                      <p className='stat-label'>Waitlist</p>
                      <p className='stat-value text-2xl'>{event.waitlistedCount}</p>
                    </div>
                    <div className='stat-block'>
                      <p className='stat-label'>Capacity</p>
                      <p className='mt-1 font-medium text-ink text-sm'>
                        {getCapacitySummary(event.capacity, event.confirmedCount, event.waitlistedCount)}
                      </p>
                    </div>
                  </div>

                  {/* Quick action */}
                  <div className='mt-6 border-border border-t pt-5'>
                    <Link
                      className='group inline-flex items-center gap-2 font-medium text-ink text-sm transition-colors hover:text-vermillion'
                      href={`/dashboard/events/${event.id}`}
                    >
                      Manage event
                      <span className='transition-transform group-hover:translate-x-1'>&rarr;</span>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

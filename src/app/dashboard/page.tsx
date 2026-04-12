import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ShareLinkButton } from '~/components/events/share-link-button'

import { env } from '~/env'
import { formatEventDate } from '~/lib/formatters'
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

  return (
    <div className='space-y-8'>

      {/* ── Page header ──────────────────────────────────────── */}
      <div className='flex items-end justify-between gap-4 border-b border-border pb-6'>
        <div>
          <p className='text-label mb-2'>Organizer dashboard</p>
          <h1 className='text-display-lg'>
            Your <span className='text-acid'>events</span>
          </h1>
        </div>
        <Link
          className='btn-primary shrink-0'
          href='/dashboard/events/new'
        >
          <svg aria-hidden='true' className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path d='M12 4v16m8-8H4' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
          </svg>
          New event
        </Link>
      </div>

      {/* ── Events ───────────────────────────────────────────── */}
      {events.length === 0 ? (
        /* Empty state */
        <div className='flex flex-col items-center justify-center rounded border border-dashed border-border py-24 text-center'>
          <div
            className='mb-6 flex h-14 w-14 items-center justify-center rounded border border-border'
            style={{ background: 'var(--color-void-surface)' }}
          >
            <svg aria-hidden='true' className='h-7 w-7 text-smoke-muted' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}
              />
            </svg>
          </div>
          <p className='font-display text-2xl uppercase tracking-wide text-smoke' style={{ fontFamily: 'var(--font-bebas)' }}>
            No events yet
          </p>
          <p className='mt-2 max-w-xs text-smoke-muted text-sm'>
            Create your first event and start collecting RSVPs. A shareable page is generated automatically.
          </p>
          <Link className='btn-primary mt-8' href='/dashboard/events/new'>
            Create your first event
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Count label */}
          <p className='text-label'>{events.length} {events.length === 1 ? 'event' : 'events'}</p>

          {/* Event rows — departures board style */}
          <div className='space-y-3'>
            {events.map((event, index) => {
              const shareUrl = new URL(`/r/${event.publicId}`, env.BETTER_AUTH_URL).toString()
              const capacitySummary = getCapacitySummary(event.capacity, event.confirmedCount, event.waitlistedCount)
              const capacityPct = getCapacityPct(event.capacity, event.confirmedCount)

              return (
                <article
                  className='group relative overflow-hidden rounded border border-border bg-void-raised transition-all duration-150 hover:border-border-strong animate-fade-up'
                  key={event.id}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Acid left accent — shown on hover */}
                  <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-acid opacity-0 transition-opacity duration-150 group-hover:opacity-100' />

                  <div className='flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6'>

                    {/* Date block */}
                    <div className='flex shrink-0 flex-col items-center justify-center rounded border border-border bg-void-surface px-4 py-3 text-center sm:w-20'>
                      <span className='font-mono text-[9px] uppercase tracking-widest text-smoke-muted'>
                        {new Date(event.startsAt).toLocaleString('en', { month: 'short' }).toUpperCase()}
                      </span>
                      <span className='font-display text-4xl leading-none text-smoke' style={{ fontFamily: 'var(--font-bebas)' }}>
                        {new Date(event.startsAt).getDate()}
                      </span>
                    </div>

                    {/* Event info */}
                    <div className='min-w-0 flex-1 space-y-1.5'>
                      <Link
                        className='block font-display text-xl uppercase tracking-wide text-smoke transition-colors group-hover:text-acid truncate'
                        href={`/dashboard/events/${event.id}`}
                        style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem' }}
                      >
                        {event.title}
                      </Link>
                      <div className='flex flex-wrap items-center gap-3'>
                        <span className='font-mono text-[11px] text-smoke-muted'>{event.location}</span>
                        <span className='h-3 w-px bg-border-strong' />
                        <span className='font-mono text-[11px] text-smoke-muted'>
                          {formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
                        </span>
                      </div>

                      {/* Capacity bar */}
                      {capacityPct !== null && (
                        <div className='flex items-center gap-3 pt-1'>
                          <div className='h-1 flex-1 max-w-48 rounded-full bg-void-surface overflow-hidden'>
                            <div
                              className='h-full rounded-full bg-acid transition-all duration-500'
                              style={{ width: `${capacityPct}%`, opacity: 0.8 }}
                            />
                          </div>
                          <span className='font-mono text-[10px] text-smoke-muted'>{capacitySummary}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className='flex shrink-0 items-center gap-4'>
                      <div className='text-center'>
                        <p className='font-mono text-[9px] uppercase tracking-widest text-smoke-muted'>Confirmed</p>
                        <p className='font-mono text-2xl text-smoke tabular-nums leading-none mt-1'>{event.confirmedCount}</p>
                      </div>
                      <div className='text-center'>
                        <p className='font-mono text-[9px] uppercase tracking-widest text-smoke-muted'>Checked&nbsp;in</p>
                        <p className='font-mono text-2xl text-acid tabular-nums leading-none mt-1'>{event.checkedInCount}</p>
                      </div>
                      {event.waitlistedCount > 0 && (
                        <div className='text-center'>
                          <p className='font-mono text-[9px] uppercase tracking-widest text-smoke-muted'>Waitlist</p>
                          <p className='font-mono text-2xl text-warn tabular-nums leading-none mt-1'>{event.waitlistedCount}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className='flex shrink-0 items-center gap-2'>
                      <ShareLinkButton shareUrl={shareUrl} />
                      <Link
                        className='btn-outline px-3 py-1.5 text-[11px]'
                        href={`/dashboard/events/${event.id}`}
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

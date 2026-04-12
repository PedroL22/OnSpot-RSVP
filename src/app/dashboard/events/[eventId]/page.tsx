import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { CheckInButton } from '~/components/events/check-in-button'
import { PromoteWaitlistButton } from '~/components/events/promote-waitlist-button'
import { ShareLinkButton } from '~/components/events/share-link-button'

import { env } from '~/env'
import { formatEventDate } from '~/lib/formatters'
import { getSession } from '~/server/better-auth/server'
import { getOrganizerEventDetail } from '~/server/queries/events'

type EventDetailPageProps = {
  params: Promise<{ eventId: string }>
}

const getStatusBadgeClassName = (status: 'CONFIRMED' | 'WAITLISTED') => {
  return status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-waitlisted'
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

  return (
    <div className='space-y-6'>

      {/* ── Back nav ─────────────────────────────────────────── */}
      <Link
        className='group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-smoke-muted transition-colors hover:text-acid'
        href='/dashboard'
      >
        <span className='transition-transform group-hover:-translate-x-0.5'>←</span>
        Back to dashboard
      </Link>

      {/* ── Event header ─────────────────────────────────────── */}
      <section className='grid gap-4 lg:grid-cols-[1fr_300px]'>

        {/* Main card */}
        <div className='relative overflow-hidden rounded border border-border bg-void-raised'>
          {/* Acid top strip */}
          <div className='h-0.5 w-full bg-acid opacity-90' />

          {/* Dot pattern overlay */}
          <div className='dot-pattern absolute inset-0 opacity-60' />

          <div className='relative p-8'>
            <div className='mb-6 flex items-start justify-between gap-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <span className='h-1.5 w-1.5 rounded-full bg-acid' />
                  <span className='text-label' style={{ color: 'rgba(201,255,0,0.6)' }}>Event Details</span>
                </div>
                <h1
                  className='text-display-lg leading-none'
                  style={{ maxWidth: '600px' }}
                >
                  {event.title}
                </h1>
              </div>

              <div className='flex shrink-0 items-center gap-2 pt-2'>
                <ShareLinkButton shareUrl={shareUrl} />
              </div>
            </div>

            <p className='mb-6 max-w-2xl text-smoke-muted leading-relaxed' style={{ fontSize: '0.9375rem' }}>
              {event.description}
            </p>

            {/* Meta grid */}
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='rounded border border-border bg-void-surface p-4'>
                <p className='stat-label'>When</p>
                <p className='font-mono text-sm text-smoke'>{formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}</p>
              </div>
              <div className='rounded border border-border bg-void-surface p-4'>
                <p className='stat-label'>Where</p>
                <p className='font-mono text-sm text-smoke'>{event.location}</p>
              </div>
              {event.capacity && (
                <div className='rounded border border-border bg-void-surface p-4'>
                  <p className='stat-label'>Capacity</p>
                  <div className='space-y-2'>
                    <p className='font-mono text-sm text-smoke'>{event.confirmedCount} / {event.capacity}</p>
                    {capacityPct !== null && (
                      <div className='h-1 rounded-full bg-void overflow-hidden'>
                        <div
                          className='h-full rounded-full bg-acid transition-all'
                          style={{ width: `${capacityPct}%`, opacity: 0.8 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Export action */}
            <div className='mt-6 pt-6 border-t border-border'>
              <Link
                className='btn-ghost px-3 py-1.5 text-[11px]'
                href={`/dashboard/events/${event.id}/export`}
              >
                <svg aria-hidden='true' className='h-3.5 w-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
                </svg>
                Export CSV
              </Link>
            </div>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-4 content-start'>
          {[
            { label: 'Confirmed', value: event.confirmedCount, color: 'var(--color-smoke)' },
            { label: 'Checked in', value: event.checkedInCount, color: 'var(--color-acid)' },
            { label: 'Waitlisted', value: event.waitlistedCount, color: 'var(--color-warn)' },
            {
              label: 'Remaining',
              value: event.remainingCapacity === null ? '∞' : event.remainingCapacity,
              color: 'var(--color-smoke)',
            },
          ].map(({ label, value, color }) => (
            <div className='stat-block' key={label}>
              <p className='stat-label'>{label}</p>
              <p className='font-mono text-4xl tabular-nums leading-none' style={{ color, fontFamily: 'var(--font-jetbrains)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Guest list ───────────────────────────────────────── */}
      <section className='card overflow-hidden'>
        <div className='flex items-center justify-between border-b border-border px-6 py-4'>
          <div>
            <h2 className='font-display text-2xl uppercase tracking-wide' style={{ fontFamily: 'var(--font-bebas)' }}>
              Guest List
            </h2>
            <p className='mt-0.5 font-mono text-[11px] text-smoke-muted'>
              {event.rsvps.length} {event.rsvps.length === 1 ? 'guest' : 'guests'} registered
            </p>
          </div>
        </div>

        {event.rsvps.length === 0 ? (
          <div className='px-6 py-16 text-center'>
            <p className='font-mono text-[11px] uppercase tracking-wider text-smoke-muted'>No guests have RSVP'd yet</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-border bg-void-surface'>
                  {['Guest', 'Status', 'RSVP\'d', 'Check-in', 'Action'].map((col) => (
                    <th className='px-5 py-3 text-left' key={col}>
                      <span className='font-mono text-[9px] uppercase tracking-[0.2em] text-smoke-muted'>{col}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {event.rsvps.map((rsvp) => (
                  <tr
                    className='transition-colors hover:bg-void-surface/50'
                    key={rsvp.id}
                  >
                    <td className='px-5 py-4'>
                      <p className='font-medium text-smoke text-sm'>{rsvp.name}</p>
                      <p className='font-mono text-[11px] text-smoke-muted mt-0.5'>{rsvp.email}</p>
                    </td>
                    <td className='px-5 py-4'>
                      <span className={getStatusBadgeClassName(rsvp.status)}>
                        {rsvp.status === 'CONFIRMED' ? 'Confirmed' : 'Waitlisted'}
                      </span>
                    </td>
                    <td className='px-5 py-4'>
                      <span className='font-mono text-[11px] text-smoke-muted'>
                        {formatEventDate(rsvp.createdAt, event.startsAtOffsetMinutes)}
                      </span>
                    </td>
                    <td className='px-5 py-4'>
                      {rsvp.checkedInAt ? (
                        <span className='font-mono text-[11px] text-success'>
                          {formatEventDate(rsvp.checkedInAt, event.startsAtOffsetMinutes)}
                        </span>
                      ) : (
                        <span className='font-mono text-[11px] text-smoke-dim'>—</span>
                      )}
                    </td>
                    <td className='px-5 py-4'>
                      {rsvp.status === 'CONFIRMED' ? (
                        <CheckInButton checkedIn={Boolean(rsvp.checkedInAt)} eventId={event.id} rsvpId={rsvp.id} />
                      ) : (
                        <PromoteWaitlistButton eventId={event.id} rsvpId={rsvp.id} status={rsvp.status} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Activity log ─────────────────────────────────────── */}
      <section className='card overflow-hidden'>
        <div className='border-b border-border px-6 py-4'>
          <h2 className='font-display text-2xl uppercase tracking-wide' style={{ fontFamily: 'var(--font-bebas)' }}>
            Activity Log
          </h2>
          <p className='mt-0.5 font-mono text-[11px] text-smoke-muted'>Recent guest activity</p>
        </div>

        {event.activities.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <p className='font-mono text-[11px] uppercase tracking-wider text-smoke-muted'>
              Activity will appear here as guests RSVP and get checked in
            </p>
          </div>
        ) : (
          <div className='divide-y divide-border'>
            {event.activities.map((activity) => (
              <div className='flex items-center justify-between gap-4 px-6 py-4' key={activity.id}>
                <div className='min-w-0 flex items-center gap-3'>
                  <div className='h-1.5 w-1.5 shrink-0 rounded-full bg-border-strong' />
                  <div>
                    <p className='truncate text-sm text-smoke'>{activity.message}</p>
                    <p className='font-mono text-[10px] text-smoke-muted mt-0.5'>
                      {activity.actorType === 'ORGANIZER'
                        ? `Organizer${activity.actorUser?.name ? `: ${activity.actorUser.name}` : ''}`
                        : activity.actorType === 'GUEST'
                          ? 'Guest'
                          : 'System'}
                    </p>
                  </div>
                </div>
                <p className='shrink-0 font-mono text-[11px] text-smoke-muted'>
                  {formatEventDate(activity.createdAt, event.startsAtOffsetMinutes)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

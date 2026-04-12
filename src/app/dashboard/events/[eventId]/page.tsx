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
  params: Promise<{
    eventId: string
  }>
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

  return (
    <div className='space-y-6'>
      {/* Back navigation */}
      <Link
        className='group inline-flex items-center gap-2 text-ink-subtle text-sm transition-colors hover:text-ink'
        href='/dashboard'
      >
        <span className='transition-transform group-hover:-translate-x-1'>&larr;</span>
        Back to dashboard
      </Link>

      {/* Event header card */}
      <section className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
        {/* Main info */}
        <div className='relative overflow-hidden rounded-2xl bg-ink p-8 lg:p-10'>
          {/* Decorative gradient */}
          <div className='absolute top-0 right-0 h-80 w-80 rounded-full bg-gradient-to-bl from-vermillion/15 to-transparent blur-3xl' />
          <div className='absolute bottom-0 left-0 h-48 w-48 rounded-full bg-gradient-to-tr from-paper/5 to-transparent blur-2xl' />

          <div className='relative space-y-6'>
            <div className='space-y-4'>
              <div className='inline-flex items-center gap-2'>
                <span className='h-1.5 w-1.5 rounded-full bg-vermillion' />
                <span className='text-label text-paper/60'>Event Details</span>
              </div>

              <h1 className='text-display-lg text-paper'>{event.title}</h1>

              <p className='max-w-xl text-paper/60 leading-relaxed'>{event.description}</p>
            </div>

            {/* Event meta */}
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-xl border border-paper/10 bg-paper/5 p-4'>
                <p className='mb-2 text-label text-paper/40'>Starts at</p>
                <p className='font-medium text-paper'>{formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}</p>
              </div>
              <div className='rounded-xl border border-paper/10 bg-paper/5 p-4'>
                <p className='mb-2 text-label text-paper/40'>Location</p>
                <p className='font-medium text-paper'>{event.location}</p>
              </div>
            </div>

            {/* Actions */}
            <div className='flex flex-wrap items-center gap-3 pt-2'>
              <ShareLinkButton shareUrl={shareUrl} />
              <Link
                className='btn-ghost text-paper/80 text-sm hover:bg-paper/10 hover:text-paper'
                href={`/dashboard/events/${event.id}/export`}
              >
                <svg
                  aria-hidden='true'
                  className='h-4 w-4'
                  fill='none'
                  focusable='false'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                  />
                </svg>
                Export CSV
              </Link>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='card p-6'>
            <p className='stat-label'>Confirmed</p>
            <p className='stat-value'>{event.confirmedCount}</p>
          </div>
          <div className='card p-6'>
            <p className='stat-label'>Checked in</p>
            <p className='stat-value'>{event.checkedInCount}</p>
          </div>
          <div className='card p-6'>
            <p className='stat-label'>Waitlist</p>
            <p className='stat-value'>{event.waitlistedCount}</p>
          </div>
          <div className='card p-6'>
            <p className='stat-label'>Remaining</p>
            <p className='stat-value'>
              {event.remainingCapacity === null ? <span className='text-3xl'>&infin;</span> : event.remainingCapacity}
            </p>
          </div>
        </div>
      </section>

      {/* Guest list table */}
      <section className='card overflow-hidden'>
        <div className='border-border border-b p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='font-serif text-2xl'>Guest List</h2>
              <p className='mt-1 text-ink-subtle text-sm'>
                {event.rsvps.length} {event.rsvps.length === 1 ? 'guest' : 'guests'} registered
              </p>
            </div>
          </div>
        </div>

        {event.rsvps.length === 0 ? (
          <div className='p-10 text-center'>
            <p className='text-ink-subtle'>No guests have RSVP&apos;d yet.</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-border border-b bg-surface-sunken'>
                  <th className='px-6 py-3 text-left text-label'>Guest</th>
                  <th className='px-6 py-3 text-left text-label'>Status</th>
                  <th className='px-6 py-3 text-left text-label'>RSVP&apos;d</th>
                  <th className='px-6 py-3 text-left text-label'>Check-in</th>
                  <th className='px-6 py-3 text-left text-label'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {event.rsvps.map((rsvp) => (
                  <tr className='transition-colors hover:bg-surface-sunken/50' key={rsvp.id}>
                    <td className='px-6 py-4'>
                      <div>
                        <p className='font-medium text-ink'>{rsvp.name}</p>
                        <p className='text-ink-subtle text-sm'>{rsvp.email}</p>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className={getStatusBadgeClassName(rsvp.status)}>
                        {rsvp.status === 'CONFIRMED' ? 'Confirmed' : 'Waitlisted'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-ink-subtle text-sm'>
                      {formatEventDate(rsvp.createdAt, event.startsAtOffsetMinutes)}
                    </td>
                    <td className='px-6 py-4 text-ink-subtle text-sm'>
                      {rsvp.checkedInAt ? (
                        <span className='font-medium text-emerald-dim'>
                          {formatEventDate(rsvp.checkedInAt, event.startsAtOffsetMinutes)}
                        </span>
                      ) : (
                        <span className='text-ink-subtle/50'>Not yet</span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
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

      {/* Activity log */}
      <section className='card'>
        <div className='border-border border-b p-6'>
          <h2 className='font-serif text-2xl'>Activity Log</h2>
          <p className='mt-1 text-ink-subtle text-sm'>Recent guest activity</p>
        </div>

        {event.activities.length === 0 ? (
          <div className='p-10 text-center'>
            <p className='text-ink-subtle'>Activity will appear here as guests RSVP and get checked in.</p>
          </div>
        ) : (
          <div className='divide-y divide-border'>
            {event.activities.map((activity) => (
              <div className='flex items-center justify-between gap-4 px-6 py-4' key={activity.id}>
                <div className='min-w-0 space-y-1'>
                  <p className='truncate font-medium text-ink'>{activity.message}</p>
                  <p className='text-ink-subtle text-sm'>
                    {activity.actorType === 'ORGANIZER'
                      ? `Organizer${activity.actorUser?.name ? `: ${activity.actorUser.name}` : ''}`
                      : activity.actorType === 'GUEST'
                        ? 'Guest'
                        : 'System'}
                  </p>
                </div>
                <p className='whitespace-nowrap text-ink-subtle text-sm'>
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

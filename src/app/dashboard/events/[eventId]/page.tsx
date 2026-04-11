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
  return status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
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
    <section className='flex flex-col gap-6'>
      <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='rounded-[2rem] bg-[#111827] p-8 text-white shadow-[0_24px_80px_rgba(17,24,39,0.24)]'>
          <div className='flex h-full flex-col justify-between gap-8'>
            <div className='space-y-4'>
              <p className='text-[#fbbf24] text-sm uppercase tracking-[0.28em]'>Event detail</p>
              <div className='space-y-3'>
                <h1 className='font-black text-4xl tracking-[-0.04em] sm:text-5xl'>{event.title}</h1>
                <p className='max-w-2xl text-slate-300 leading-7'>{event.description}</p>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4'>
                  <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Starts at</p>
                  <p className='mt-2 font-semibold text-lg'>
                    {formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
                  </p>
                </div>
                <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4'>
                  <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Location</p>
                  <p className='mt-2 font-semibold text-lg'>{event.location}</p>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <ShareLinkButton shareUrl={shareUrl} />
              <Link
                className='inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-4 py-2 font-medium text-sm text-white transition hover:bg-white/14'
                href={`/dashboard/events/${event.id}/export`}
              >
                Export CSV
              </Link>
              <Link className='inline-flex items-center text-[#fbbf24] underline underline-offset-4' href='/dashboard'>
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
          <div className='rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
            <p className='text-slate-500 text-sm'>Confirmed guests</p>
            <p className='mt-3 font-bold text-4xl tracking-[-0.04em]'>{event.confirmedCount}</p>
          </div>
          <div className='rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
            <p className='text-slate-500 text-sm'>Checked in</p>
            <p className='mt-3 font-bold text-4xl tracking-[-0.04em]'>{event.checkedInCount}</p>
          </div>
          <div className='rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
            <p className='text-slate-500 text-sm'>Waitlist</p>
            <p className='mt-3 font-bold text-4xl tracking-[-0.04em]'>{event.waitlistedCount}</p>
          </div>
          <div className='rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
            <p className='text-slate-500 text-sm'>Remaining capacity</p>
            <p className='mt-3 font-bold text-4xl tracking-[-0.04em]'>
              {event.remainingCapacity === null ? '∞' : event.remainingCapacity}
            </p>
          </div>
        </div>
      </div>

      <div className='rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
        <div className='mb-6 flex flex-col gap-2'>
          <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>Guest list</p>
          <h2 className='font-bold text-3xl tracking-[-0.03em]'>RSVPs and check-in</h2>
        </div>

        {event.rsvps.length === 0 ? (
          <p className='rounded-[1.5rem] bg-[#faf7f2] px-5 py-4 text-slate-600'>No guests have RSVP&apos;d yet.</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full border-separate border-spacing-y-3'>
              <thead>
                <tr className='text-left text-slate-500 text-sm'>
                  <th className='px-4 py-2 font-medium'>Guest</th>
                  <th className='px-4 py-2 font-medium'>Status</th>
                  <th className='px-4 py-2 font-medium'>RSVP&apos;d</th>
                  <th className='px-4 py-2 font-medium'>Check-in</th>
                  <th className='px-4 py-2 font-medium'>Action</th>
                </tr>
              </thead>
              <tbody>
                {event.rsvps.map((rsvp) => (
                  <tr className='rounded-[1.5rem] bg-[#faf7f2]' key={rsvp.id}>
                    <td className='rounded-l-[1.5rem] px-4 py-4 align-top'>
                      <div className='flex flex-col gap-1'>
                        <p className='font-semibold'>{rsvp.name}</p>
                        <p className='text-slate-600 text-sm'>{rsvp.email}</p>
                      </div>
                    </td>
                    <td className='px-4 py-4 align-top'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 font-medium text-xs uppercase tracking-[0.18em] ${getStatusBadgeClassName(rsvp.status)}`}
                      >
                        {rsvp.status === 'CONFIRMED' ? 'Confirmed' : 'Waitlisted'}
                      </span>
                    </td>
                    <td className='px-4 py-4 align-top text-slate-600 text-sm'>
                      {formatEventDate(rsvp.createdAt, event.startsAtOffsetMinutes)}
                    </td>
                    <td className='px-4 py-4 align-top text-slate-600 text-sm'>
                      {rsvp.checkedInAt ? formatEventDate(rsvp.checkedInAt, event.startsAtOffsetMinutes) : 'Not yet'}
                    </td>
                    <td className='rounded-r-[1.5rem] px-4 py-4 align-top'>
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
      </div>

      <div className='rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
        <div className='mb-6 flex flex-col gap-2'>
          <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>Activity log</p>
          <h2 className='font-bold text-3xl tracking-[-0.03em]'>Recent guest activity</h2>
        </div>

        {event.activities.length === 0 ? (
          <p className='rounded-[1.5rem] bg-[#faf7f2] px-5 py-4 text-slate-600'>
            Activity will appear here as guests RSVP and get checked in.
          </p>
        ) : (
          <div className='flex flex-col gap-3'>
            {event.activities.map((activity) => (
              <div className='rounded-[1.5rem] bg-[#faf7f2] px-5 py-4' key={activity.id}>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='space-y-1'>
                    <p className='font-medium'>{activity.message}</p>
                    <p className='text-slate-500 text-sm'>
                      {activity.actorType === 'ORGANIZER'
                        ? `Organizer${activity.actorUser?.name ? `: ${activity.actorUser.name}` : ''}`
                        : activity.actorType === 'GUEST'
                          ? 'Guest'
                          : 'System'}
                    </p>
                  </div>
                  <p className='text-slate-500 text-sm'>
                    {formatEventDate(activity.createdAt, event.startsAtOffsetMinutes)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

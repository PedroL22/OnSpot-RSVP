import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ShareLinkButton } from '~/components/events/share-link-button'

import { env } from '~/env'
import { formatEventDate } from '~/lib/formatters'
import { getSession } from '~/server/better-auth/server'
import { getOrganizerEvents } from '~/server/queries/events'

const getCapacitySummary = (capacity: number | null, confirmedCount: number, waitlistedCount: number) => {
  if (capacity === null) {
    return 'Unlimited attendance'
  }

  if (waitlistedCount > 0) {
    return `${confirmedCount}/${capacity} confirmed, ${waitlistedCount} waitlisted`
  }

  return `${confirmedCount}/${capacity} confirmed`
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/sign-in?callbackURL=/dashboard')
  }

  const events = await getOrganizerEvents(session.user.id)

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4 rounded-[2rem] bg-[#111827] px-8 py-8 text-white shadow-[0_24px_80px_rgba(17,24,39,0.24)] lg:flex-row lg:items-end lg:justify-between'>
        <div className='max-w-2xl space-y-3'>
          <p className='text-[#fbbf24] text-sm uppercase tracking-[0.28em]'>Organizer dashboard</p>
          <h1 className='font-black text-4xl tracking-[-0.04em] sm:text-5xl'>
            Your events, RSVPs, and day-of check-in in one place.
          </h1>
          <p className='max-w-xl text-slate-300 leading-7'>
            Build the public RSVP page once, then manage confirmations, waitlist promotions, and check-ins from the same
            dashboard.
          </p>
        </div>

        <Link
          className='inline-flex items-center justify-center rounded-full bg-[#fbbf24] px-6 py-3 font-semibold text-[#111827] transition hover:bg-[#f6c64f]'
          href='/dashboard/events/new'
        >
          Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className='rounded-[2rem] border border-[#111827]/15 border-dashed bg-white px-8 py-12 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
          <div className='max-w-xl space-y-4'>
            <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>No events yet</p>
            <h2 className='font-bold text-3xl tracking-[-0.03em]'>
              Create your first event and start collecting RSVPs.
            </h2>
            <p className='text-slate-600 leading-7'>
              The public page is generated automatically once an event exists, so the fastest path is to create one and
              share its link.
            </p>
            <Link
              className='inline-flex items-center justify-center rounded-full bg-[#111827] px-6 py-3 font-semibold text-white transition hover:bg-[#1f2937]'
              href='/dashboard/events/new'
            >
              Create event
            </Link>
          </div>
        </div>
      ) : (
        <div className='grid gap-5 xl:grid-cols-2'>
          {events.map((event) => {
            const shareUrl = new URL(`/r/${event.publicId}`, env.BETTER_AUTH_URL).toString()

            return (
              <article
                className='flex flex-col gap-6 rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'
                key={event.id}
              >
                <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='space-y-3'>
                    <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>
                      {formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
                    </p>
                    <div className='space-y-2'>
                      <Link className='font-bold text-2xl tracking-[-0.03em]' href={`/dashboard/events/${event.id}`}>
                        {event.title}
                      </Link>
                      <p className='text-slate-600'>{event.location}</p>
                    </div>
                  </div>

                  <ShareLinkButton shareUrl={shareUrl} />
                </div>

                <div className='grid gap-4 sm:grid-cols-4'>
                  <div className='rounded-[1.5rem] bg-[#faf7f2] p-4'>
                    <p className='text-slate-500 text-sm'>Confirmed</p>
                    <p className='mt-2 font-semibold text-2xl'>{event.confirmedCount}</p>
                  </div>
                  <div className='rounded-[1.5rem] bg-[#faf7f2] p-4'>
                    <p className='text-slate-500 text-sm'>Checked in</p>
                    <p className='mt-2 font-semibold text-2xl'>{event.checkedInCount}</p>
                  </div>
                  <div className='rounded-[1.5rem] bg-[#faf7f2] p-4'>
                    <p className='text-slate-500 text-sm'>Waitlist</p>
                    <p className='mt-2 font-semibold text-2xl'>{event.waitlistedCount}</p>
                  </div>
                  <div className='rounded-[1.5rem] bg-[#faf7f2] p-4'>
                    <p className='text-slate-500 text-sm'>Capacity</p>
                    <p className='mt-2 font-semibold text-lg'>
                      {getCapacitySummary(event.capacity, event.confirmedCount, event.waitlistedCount)}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

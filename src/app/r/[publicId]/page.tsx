import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PublicRsvpForm } from '~/components/events/public-rsvp-form'

import { formatEventDate } from '~/lib/formatters'
import { getPublicEvent } from '~/server/queries/events'

type PublicEventPageProps = {
  params: Promise<{
    publicId: string
  }>
}

const getCapacityMessage = (capacity: number | null, remainingCapacity: number | null) => {
  if (capacity === null) {
    return 'Unlimited capacity. Everyone who RSVPs will be confirmed automatically.'
  }

  if ((remainingCapacity ?? 0) > 0) {
    return `${remainingCapacity} confirmed spot${remainingCapacity === 1 ? '' : 's'} left before new RSVPs join the waitlist.`
  }

  return 'Confirmed spots are full. New RSVPs will join the waitlist.'
}

export default async function PublicEventPage({ params }: PublicEventPageProps) {
  const { publicId } = await params
  const event = await getPublicEvent(publicId)

  if (!event) {
    notFound()
  }

  const submitLabel = event.remainingCapacity === 0 ? 'Join waitlist' : 'Confirm attendance'

  return (
    <main className='min-h-screen bg-[#f6efe5] px-6 py-10 text-[#111827] sm:px-8 lg:px-10'>
      <div className='mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]'>
        <section className='relative overflow-hidden rounded-[2rem] bg-[#111827] p-8 text-white shadow-[0_24px_80px_rgba(17,24,39,0.24)] sm:p-12'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_32%)]' />

          <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,transparent_62%,rgba(255,255,255,0.03))]' />

          <div className='relative flex h-full flex-col justify-between gap-10'>
            <div className='space-y-6'>
              <Link
                className='inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-1 text-[#fbbf24] text-xs uppercase tracking-[0.28em]'
                href='/'
              >
                OnSpot RSVP
              </Link>

              <div className='space-y-5'>
                <h1 className='max-w-3xl font-black text-5xl tracking-[-0.04em] sm:text-6xl'>{event.title}</h1>
                <p className='max-w-2xl text-base text-slate-300 leading-7 sm:text-lg'>{event.description}</p>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-3'>
              <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm'>
                <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Starts at</p>
                <p className='mt-2 font-semibold text-lg'>
                  {formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
                </p>
              </div>

              <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm'>
                <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Location</p>
                <p className='mt-2 font-semibold text-lg'>{event.location}</p>
              </div>

              <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm'>
                <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Capacity</p>
                <p className='mt-2 font-semibold text-lg'>
                  {getCapacityMessage(event.capacity, event.remainingCapacity)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10'>
          <div className='flex h-full flex-col justify-between gap-8'>
            <div className='space-y-3'>
              <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>Public RSVP</p>
              <h2 className='font-bold text-3xl tracking-[-0.03em]'>Reserve your spot or join the waitlist.</h2>
              <p className='text-base text-slate-600 leading-7'>
                RSVP once with your name and email. If confirmed spots are full, you will automatically join the
                waitlist.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-3'>
              <div className='rounded-[1.5rem] bg-[#faf7f2] p-4'>
                <p className='text-slate-500 text-sm'>Confirmed</p>
                <p className='mt-2 font-semibold text-2xl'>{event.confirmedCount}</p>
              </div>

              <div className='rounded-[1.5rem] bg-[#faf7f2] p-4'>
                <p className='text-slate-500 text-sm'>Waitlist</p>
                <p className='mt-2 font-semibold text-2xl'>{event.waitlistedCount}</p>
              </div>

              <div className='rounded-[1.5rem] bg-[#faf7f2] p-4'>
                <p className='text-slate-500 text-sm'>Spots left</p>
                <p className='mt-2 font-semibold text-2xl'>
                  {event.remainingCapacity === null ? '∞' : event.remainingCapacity}
                </p>
              </div>
            </div>

            <PublicRsvpForm eventPublicId={event.publicId} submitLabel={submitLabel} />
          </div>
        </section>
      </div>
    </main>
  )
}

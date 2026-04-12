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
    return 'Open attendance'
  }

  if ((remainingCapacity ?? 0) > 0) {
    return `${remainingCapacity} spot${remainingCapacity === 1 ? '' : 's'} left`
  }

  return 'Waitlist only'
}

export default async function PublicEventPage({ params }: PublicEventPageProps) {
  const { publicId } = await params
  const event = await getPublicEvent(publicId)

  if (!event) {
    notFound()
  }

  const submitLabel = event.remainingCapacity === 0 ? 'Join waitlist' : 'Confirm attendance'
  const isFull = event.remainingCapacity === 0

  return (
    <main className='min-h-screen'>
      {/* Background pattern */}
      <div className='grid-pattern pointer-events-none fixed inset-0 opacity-30' />

      <div className='relative mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-16'>
        {/* Header */}
        <header className='mb-10 animate-fade-up'>
          <Link className='group inline-flex items-center gap-3' href='/'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-ink transition-transform duration-300 group-hover:scale-105'>
              <svg
                aria-hidden='true'
                className='h-5 w-5 text-paper'
                fill='currentColor'
                focusable='false'
                viewBox='0 0 24 24'
              >
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
            <span className='text-label'>OnSpot RSVP</span>
          </Link>
        </header>

        {/* Main content grid */}
        <div className='grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12'>
          {/* Left - Event details */}
          <section className='animation-delay-100 relative animate-fade-up overflow-hidden rounded-2xl bg-ink p-8 lg:p-12'>
            {/* Decorative elements */}
            <div className='diagonal-lines absolute inset-0 opacity-20' />
            <div className='absolute top-0 right-0 h-80 w-80 rounded-full bg-gradient-to-bl from-vermillion/20 to-transparent blur-3xl' />
            <div className='absolute bottom-0 left-0 h-48 w-48 rounded-full bg-gradient-to-tr from-paper/5 to-transparent blur-2xl' />

            {/* Ticket stub edge effect */}
            <div className='ticket-edge-right absolute top-0 right-0 bottom-0 w-6 opacity-20' />

            <div className='relative space-y-8'>
              {/* Event title */}
              <div className='space-y-4'>
                <div className='inline-flex items-center gap-2'>
                  <span className='h-1.5 w-1.5 rounded-full bg-vermillion' />
                  <span className='text-label text-paper/50'>Event Invitation</span>
                </div>

                <h1 className='text-display-xl text-paper'>{event.title}</h1>

                <p className='max-w-xl text-lg text-paper/60 leading-relaxed'>{event.description}</p>
              </div>

              {/* Event meta cards */}
              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='rounded-xl border border-paper/10 bg-paper/5 p-5'>
                  <p className='mb-2 text-label text-paper/40'>When</p>
                  <p className='font-medium text-paper'>
                    {formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
                  </p>
                </div>

                <div className='rounded-xl border border-paper/10 bg-paper/5 p-5'>
                  <p className='mb-2 text-label text-paper/40'>Where</p>
                  <p className='font-medium text-paper'>{event.location}</p>
                </div>

                <div className='rounded-xl border border-paper/10 bg-paper/5 p-5'>
                  <p className='mb-2 text-label text-paper/40'>Availability</p>
                  <p className={`font-medium ${isFull ? 'text-amber' : 'text-emerald'}`}>
                    {getCapacityMessage(event.capacity, event.remainingCapacity)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right - RSVP form */}
          <section className='card-elevated animation-delay-200 animate-fade-up p-8 lg:p-10'>
            <div className='space-y-8'>
              {/* Form header */}
              <div className='space-y-3'>
                <p className='text-label text-vermillion'>RSVP</p>
                <h2 className='text-display-md'>
                  Reserve your
                  <br />
                  <span className='italic'>spot</span>
                </h2>
                <p className='text-ink-subtle leading-relaxed'>
                  {isFull
                    ? "Confirmed spots are full. Join the waitlist and we'll notify you if a spot opens up."
                    : 'Enter your details below to confirm your attendance. It only takes a moment.'}
                </p>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-3 gap-3'>
                <div className='stat-block text-center'>
                  <p className='stat-label'>Confirmed</p>
                  <p className='stat-value text-2xl'>{event.confirmedCount}</p>
                </div>
                <div className='stat-block text-center'>
                  <p className='stat-label'>Waitlist</p>
                  <p className='stat-value text-2xl'>{event.waitlistedCount}</p>
                </div>
                <div className='stat-block text-center'>
                  <p className='stat-label'>Remaining</p>
                  <p className='stat-value text-2xl'>
                    {event.remainingCapacity === null ? <span>&infin;</span> : event.remainingCapacity}
                  </p>
                </div>
              </div>

              {/* RSVP Form */}
              <PublicRsvpForm eventPublicId={event.publicId} submitLabel={submitLabel} />
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className='animation-delay-400 mt-16 animate-fade-up text-center'>
          <p className='text-ink-subtle text-xs'>
            Powered by{' '}
            <Link className='font-medium text-ink transition-colors hover:text-vermillion' href='/'>
              OnSpot RSVP
            </Link>
          </p>
        </footer>
      </div>
    </main>
  )
}

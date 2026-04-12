import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PublicRsvpForm } from '~/components/events/public-rsvp-form'

import { formatEventDate } from '~/lib/formatters'
import { getPublicEvent } from '~/server/queries/events'

type PublicEventPageProps = {
  params: Promise<{ publicId: string }>
}

const getCapacityMessage = (capacity: number | null, remainingCapacity: number | null) => {
  if (capacity === null) return 'Open attendance'
  if ((remainingCapacity ?? 0) > 0) return `${remainingCapacity} spot${remainingCapacity === 1 ? '' : 's'} remaining`
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

  const capacityPct =
    event.capacity && event.capacity > 0
      ? Math.min(100, Math.round((event.confirmedCount / event.capacity) * 100))
      : null

  return (
    <main className='relative min-h-screen'>
      {/* Dot pattern */}
      <div className='dot-pattern pointer-events-none fixed inset-0' />

      {/* Acid top bar */}
      <div className='fixed top-0 left-0 right-0 z-50 h-0.5 bg-acid opacity-80' />

      {/* Ambient glow */}
      <div className='pointer-events-none fixed top-0 right-0 h-[600px] w-[600px]'
        style={{ background: 'radial-gradient(circle at 80% 10%, rgba(201,255,0,0.05) 0%, transparent 60%)' }} />

      <div className='relative mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-16'>

        {/* ── Header ───────────────────────────────────────────── */}
        <header className='mb-12 flex items-center justify-between animate-fade-in'>
          <Link className='group flex items-center gap-2.5' href='/'>
            <div className='flex h-8 w-8 items-center justify-center rounded bg-acid transition-colors group-hover:bg-acid-dim'>
              <svg aria-hidden='true' className='h-4 w-4' fill='currentColor' focusable='false' viewBox='0 0 24 24'
                style={{ filter: 'invert(1)' }}>
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
            <span className='font-mono text-[11px] uppercase tracking-widest text-smoke'>OnSpot</span>
          </Link>

          <div className='flex items-center gap-2 rounded border border-border px-3 py-1.5'
            style={{ background: 'var(--color-void-raised)' }}>
            <span className='h-1.5 w-1.5 rounded-full bg-acid animate-pulse' />
            <span className='font-mono text-[10px] uppercase tracking-wider text-acid opacity-80'>Live event</span>
          </div>
        </header>

        {/* ── Main grid ────────────────────────────────────────── */}
        <div className='grid items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-10'>

          {/* ── Left — Event ticket ──────────────────────────── */}
          <section className='animate-fade-up relative overflow-hidden rounded border border-border bg-void-raised'>
            {/* Acid top strip */}
            <div className='h-0.5 w-full bg-acid' />

            {/* Dot pattern overlay */}
            <div className='dot-pattern absolute inset-0 opacity-60' />

            {/* Ticket perforations — right edge */}
            <div className='absolute right-0 top-0 bottom-0 w-6 opacity-30' style={{
              backgroundImage: 'radial-gradient(circle at 100% 50%, transparent 4px, var(--color-void-raised) 4px)',
              backgroundSize: '8px 16px',
              backgroundRepeat: 'repeat-y',
              backgroundPosition: '100% 0',
            }} />

            <div className='relative p-8 lg:p-10'>

              {/* Event label */}
              <div className='mb-6 flex items-center gap-2'>
                <span className='h-1.5 w-1.5 rounded-full bg-acid' />
                <span className='text-label' style={{ color: 'rgba(201,255,0,0.6)' }}>Event Invitation</span>
              </div>

              {/* Title */}
              <h1 className='text-display-xl mb-4 leading-none' style={{ maxWidth: '640px' }}>
                {event.title}
              </h1>

              <p className='mb-8 max-w-xl text-smoke-muted leading-relaxed' style={{ fontSize: '1.0625rem' }}>
                {event.description}
              </p>

              {/* Divider */}
              <div className='mb-8 h-px w-full bg-border' />

              {/* Event details — info grid */}
              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='space-y-2'>
                  <p className='text-label'>When</p>
                  <p className='font-mono text-sm text-smoke leading-snug'>
                    {formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
                  </p>
                </div>

                <div className='space-y-2'>
                  <p className='text-label'>Where</p>
                  <p className='font-mono text-sm text-smoke leading-snug'>{event.location}</p>
                </div>

                <div className='space-y-2'>
                  <p className='text-label'>Availability</p>
                  <p className='font-mono text-sm leading-snug'
                    style={{ color: isFull ? 'var(--color-warn)' : 'var(--color-success)' }}>
                    {getCapacityMessage(event.capacity, event.remainingCapacity)}
                  </p>
                </div>
              </div>

              {/* Capacity bar */}
              {capacityPct !== null && (
                <div className='mt-8 space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-label'>Capacity</span>
                    <span className='font-mono text-[11px] text-smoke-muted'>{capacityPct}% filled</span>
                  </div>
                  <div className='h-1.5 rounded-full bg-void-surface overflow-hidden'>
                    <div
                      className='h-full rounded-full transition-all duration-700'
                      style={{
                        width: `${capacityPct}%`,
                        background: capacityPct >= 90
                          ? 'var(--color-danger)'
                          : capacityPct >= 70
                            ? 'var(--color-warn)'
                            : 'var(--color-acid)',
                        opacity: 0.9,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className='mt-8 flex items-center gap-6 pt-6 border-t border-border'>
                <div>
                  <p className='font-mono text-3xl tabular-nums text-smoke leading-none'
                    style={{ fontFamily: 'var(--font-jetbrains)' }}>
                    {event.confirmedCount}
                  </p>
                  <p className='text-label mt-1'>Confirmed</p>
                </div>
                {event.waitlistedCount > 0 && (
                  <>
                    <div className='h-8 w-px bg-border' />
                    <div>
                      <p className='font-mono text-3xl tabular-nums leading-none'
                        style={{ color: 'var(--color-warn)', fontFamily: 'var(--font-jetbrains)' }}>
                        {event.waitlistedCount}
                      </p>
                      <p className='text-label mt-1'>Waitlisted</p>
                    </div>
                  </>
                )}
                {event.remainingCapacity !== null && event.remainingCapacity > 0 && (
                  <>
                    <div className='h-8 w-px bg-border' />
                    <div>
                      <p className='font-mono text-3xl tabular-nums text-acid leading-none'
                        style={{ fontFamily: 'var(--font-jetbrains)' }}>
                        {event.remainingCapacity}
                      </p>
                      <p className='text-label mt-1'>Spots left</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ── Right — RSVP form ──────────────────────────────── */}
          <section className='animation-delay-200 animate-fade-up'>
            <div className='card-elevated overflow-hidden'>
              {/* Acid strip */}
              <div className='h-0.5 w-full bg-acid' />

              <div className='p-8'>
                {/* Header */}
                <div className='mb-8 space-y-3'>
                  <p className='text-label text-acid' style={{ color: 'var(--color-acid)', opacity: 0.8 }}>
                    {isFull ? 'Join waitlist' : 'RSVP'}
                  </p>
                  <h2 className='text-display-md leading-none'>
                    {isFull ? 'Secure your' : 'Reserve your'}
                    <br />
                    <span className='text-acid'>spot</span>
                  </h2>
                  <p className='text-smoke-muted text-sm leading-relaxed'>
                    {isFull
                      ? "Confirmed spots are full. Join the waitlist and we'll notify you if one opens up."
                      : 'Enter your details to confirm attendance. Takes under 30 seconds.'}
                  </p>
                </div>

                {/* Form */}
                <PublicRsvpForm eventPublicId={event.publicId} submitLabel={submitLabel} />
              </div>
            </div>

            {/* Powered by tag */}
            <p className='mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-smoke-dim'>
              Powered by{' '}
              <Link className='text-smoke-muted transition-colors hover:text-acid' href='/'>
                OnSpot RSVP
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

import { notFound } from 'next/navigation'

import { BrandMark } from '~/components/brand/brand-mark'
import { PatternBackground } from '~/components/layout/pattern-background'
import { ThemeToggle } from '~/components/theme-toggle'
import { PublicEventHeroCard } from './_components/public-event-hero-card'
import { PublicRsvpSidebar } from './_components/public-rsvp-sidebar'

import { formatEventDate } from '~/lib/formatters'
import { getPublicEvent } from '~/server/queries/events'

type PublicEventPageProps = {
  params: Promise<{ publicId: string }>
}

const getAvailabilityLabel = (capacity: number | null, remainingCapacity: number | null) => {
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
      <PatternBackground className='opacity-70' />
      <div className='fixed top-0 right-0 left-0 z-50 h-1 bg-primary/80' />
      <div className='pointer-events-none fixed top-0 right-0 size-144 bg-[radial-gradient(circle_at_80%_10%,rgba(0,166,244,0.10),transparent_60%)]' />

      <div className='relative mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-16'>
        <header className='mb-12 flex animate-[fade-in_0.4s_ease_both] items-center justify-between gap-4'>
          <BrandMark />

          <div className='flex items-center gap-3'>
            <ThemeToggle />

            <div className='flex items-center justify-center rounded-full border border-border bg-card/80 px-3 py-1.5'>
              <span className='font-mono text-[10px] text-primary uppercase tracking-[0.2em]'>Live event</span>
            </div>
          </div>
        </header>

        <div className='grid items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-10'>
          <PublicEventHeroCard
            availabilityLabel={getAvailabilityLabel(event.capacity, event.remainingCapacity)}
            capacitySummary={capacityPct === null ? null : `${capacityPct}% filled`}
            capacityValue={capacityPct}
            description={event.description}
            location={event.location}
            startsAtLabel={formatEventDate(event.startsAt, event.startsAtOffsetMinutes)}
            title={event.title}
          />

          <PublicRsvpSidebar eventPublicId={event.publicId} isFull={isFull} submitLabel={submitLabel} />
        </div>
      </div>
    </main>
  )
}

import Link from 'next/link'

import { CaretLeft, Export } from '@phosphor-icons/react/dist/ssr'

import { ShareLinkButton } from '~/components/events/share-link-button'
import { Card, CardContent } from '~/components/ui/card'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import { DisplayTitle } from '~/components/layout/display-title'
import { Eyebrow } from '~/components/layout/eyebrow'
import { EventMetaGrid } from './event-meta-grid'

type EventDetailHeroProps = {
  capacityLabel: string | null
  capacityValue: number | null
  description: string
  eventId: string
  location: string
  shareUrl: string
  startsAtLabel: string
  title: string
}

export const EventDetailHero = ({
  capacityLabel,
  capacityValue,
  description,
  eventId,
  location,
  shareUrl,
  startsAtLabel,
  title,
}: EventDetailHeroProps) => {
  return (
    <div className='space-y-6'>
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'ghost' }),
          'w-fit gap-2 font-mono text-[11px] uppercase tracking-[0.16em]'
        )}
        href='/dashboard'
      >
        <CaretLeft data-icon='inline-start' />
        Back to dashboard
      </Link>

      <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-[var(--shadow-md)]'>
        <div className='h-1 w-full bg-primary' />
        <CardContent className='space-y-6 p-8'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div className='space-y-4'>
              <Eyebrow withDot>Event details</Eyebrow>
              <DisplayTitle className='max-w-2xl' size='lg'>
                {title}
              </DisplayTitle>
              <p className='max-w-2xl text-muted-foreground text-sm leading-relaxed'>{description}</p>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              <ShareLinkButton shareUrl={shareUrl} />
              <Link
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'gap-2 font-mono text-[11px] uppercase tracking-[0.16em]'
                )}
                href={`/dashboard/events/${eventId}/export`}
              >
                <Export data-icon='inline-start' />
                Export CSV
              </Link>
            </div>
          </div>

          <EventMetaGrid
            capacityLabel={capacityLabel}
            capacityValue={capacityValue}
            location={location}
            startsAtLabel={startsAtLabel}
          />
        </CardContent>
      </Card>
    </div>
  )
}

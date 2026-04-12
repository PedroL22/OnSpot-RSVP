import { ExportIcon } from '@phosphor-icons/react/dist/ssr'
import { ShareLinkButton } from '~/components/events/share-link-button'
import { DisplayTitle } from '~/components/layout/display-title'
import { Eyebrow } from '~/components/layout/eyebrow'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { EventMetaGrid } from './event-meta-grid'

import { cn } from '~/lib/utils'

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
    <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-(--shadow-md)'>
      <div className='h-1 w-full bg-primary' />

      <CardContent className='space-y-6 p-8 pt-4'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div className='w-full space-y-4'>
            <div className='flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center'>
              <div className='space-y-4'>
                <Eyebrow withDot>Event details</Eyebrow>

                <DisplayTitle className='max-w-2xl' size='lg'>
                  {title}
                </DisplayTitle>
              </div>

              <div className='flex h-fit w-fit flex-wrap items-center justify-end gap-2'>
                <ShareLinkButton shareUrl={shareUrl} />

                <a
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'gap-2 font-mono text-[11px] uppercase tracking-[0.16em]'
                  )}
                  href={`/dashboard/events/${eventId}/export`}
                >
                  <ExportIcon data-icon='inline-start' />
                  Export CSV
                </a>
              </div>
            </div>

            <p className='max-w-2xl text-muted-foreground text-sm leading-relaxed'>{description}</p>
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
  )
}

import Link from 'next/link'

import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import { CapacityMeter } from '~/components/data/capacity-meter'
import { ShareLinkButton } from '~/components/events/share-link-button'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

import { cn } from '~/lib/utils'

type EventListItemProps = {
  capacitySummary: string | null
  capacityValue: number | null
  checkedInCount: number
  confirmedCount: number
  dayLabel: number
  href: string
  location: string
  monthLabel: string
  shareUrl: string
  startsAtLabel: string
  title: string
  waitlistedCount: number
}

export const EventListItem = ({
  capacitySummary,
  capacityValue,
  checkedInCount,
  confirmedCount,
  dayLabel,
  href,
  location,
  monthLabel,
  shareUrl,
  startsAtLabel,
  title,
  waitlistedCount,
}: EventListItemProps) => {
  return (
    <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-(--shadow-sm)'>
      <div className='h-1 w-full bg-primary/80' />

      <CardContent className='p-5 pt-2.5'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6'>
          <div className='flex shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-muted/60 px-4 py-3 text-center sm:w-20'>
            <span className='font-mono text-[9px] text-muted-foreground uppercase tracking-[0.22em]'>{monthLabel}</span>
            <span className='font-display text-4xl text-foreground leading-none'>{dayLabel}</span>
          </div>

          <div className='min-w-0 flex-1 space-y-2'>
            <Link
              className='block truncate font-display text-[1.6rem] text-foreground uppercase leading-none tracking-[0.03em] transition-colors hover:text-primary'
              href={href}
            >
              {title}
            </Link>

            <div className='flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground'>
              <span>{location}</span>
              <span className='h-3 w-px bg-border-strong' />
              <span>{startsAtLabel}</span>
            </div>

            <CapacityMeter className='max-w-xs pt-1' summary={capacitySummary} value={capacityValue} />
          </div>

          <div className='grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-3'>
            <div className='shrink-0 rounded-2xl border border-border bg-muted/40 p-3 text-center'>
              <p className='font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]'>Confirmed</p>
              <p className='mt-2 font-mono text-2xl text-foreground tabular-nums leading-none'>{confirmedCount}</p>
            </div>

            <div className='shrink-0 rounded-2xl border border-border bg-muted/40 p-3 text-center'>
              <p className='font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]'>Checked in</p>
              <p className='mt-2 font-mono text-2xl text-primary tabular-nums leading-none'>{checkedInCount}</p>
            </div>

            {waitlistedCount > 0 && (
              <div className='shrink-0 rounded-2xl border border-border bg-muted/40 p-3 text-center'>
                <p className='font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]'>Waitlist</p>
                <p className='mt-2 font-mono text-2xl text-warning tabular-nums leading-none'>{waitlistedCount}</p>
              </div>
            )}
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <ShareLinkButton shareUrl={shareUrl} />

            <Link
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'gap-2 font-mono text-[11px] uppercase tracking-[0.16em]'
              )}
              href={href}
            >
              Manage
              <ArrowRightIcon data-icon='inline-end' />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

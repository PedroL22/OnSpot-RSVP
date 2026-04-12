import Link from 'next/link'

import { CaretLeft } from '@phosphor-icons/react/dist/ssr'

import { DisplayTitle } from '~/components/layout/display-title'
import { Eyebrow } from '~/components/layout/eyebrow'
import { Card, CardContent } from '~/components/ui/card'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export const EventCreateIntro = () => {
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

      <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-[var(--shadow-sm)]'>
        <div className='h-1 w-full bg-primary' />
        <CardContent className='space-y-8 p-8'>
          <div className='space-y-4'>
            <Eyebrow withDot>New event</Eyebrow>
            <DisplayTitle size='lg'>
              Create your
              <br />
              <span className='text-primary'>event</span>
            </DisplayTitle>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Set up once, share immediately. The public RSVP page is generated automatically and capacity limits are
              enforced server-side.
            </p>
          </div>

          <div className='rounded-2xl border border-border bg-muted/50 p-5'>
            <p className='font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]'>What happens next</p>
            <ul className='mt-4 space-y-3'>
              {[
                'Public RSVP page is created automatically.',
                'Capacity limits stay enforced at the server boundary.',
                'Waitlisted guests can be promoted manually from the dashboard.',
              ].map((item, index) => (
                <li className='flex items-start gap-3 text-muted-foreground text-sm' key={item}>
                  <span className='mt-0.5 shrink-0 font-mono text-[10px] text-primary'>0{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import Link from 'next/link'

import { PublicRsvpForm } from '~/components/events/public-rsvp-form'
import { DisplayTitle } from '~/components/layout/display-title'
import { Eyebrow } from '~/components/layout/eyebrow'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

type PublicRsvpSidebarProps = {
  eventPublicId: string
  isFull: boolean
  submitLabel: string
}

export const PublicRsvpSidebar = ({ eventPublicId, isFull, submitLabel }: PublicRsvpSidebarProps) => {
  return (
    <div className='space-y-4'>
      <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-[var(--shadow-md)]'>
        <div className='h-1 w-full bg-primary' />
        <CardHeader className='px-8 pt-8'>
          <Eyebrow>{isFull ? 'Join waitlist' : 'RSVP'}</Eyebrow>
          <CardTitle className='p-0'>
            <DisplayTitle size='md'>
              {isFull ? 'Secure your' : 'Reserve your'}
              <br />
              <span className='text-primary'>spot</span>
            </DisplayTitle>
          </CardTitle>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            {isFull
              ? "Confirmed spots are full. Join the waitlist and we'll notify you if one opens up."
              : 'Enter your details to confirm attendance. Takes under 30 seconds.'}
          </p>
        </CardHeader>
        <CardContent className='px-8 pb-8'>
          <PublicRsvpForm eventPublicId={eventPublicId} submitLabel={submitLabel} />
        </CardContent>
      </Card>

      <p className='text-center font-mono text-[10px] text-dim-foreground uppercase tracking-[0.18em]'>
        Powered by{' '}
        <Link className='text-muted-foreground transition-colors hover:text-primary' href='/'>
          OnSpot RSVP
        </Link>
      </p>
    </div>
  )
}

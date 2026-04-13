import Link from 'next/link'

import { CalendarDotsIcon } from '@phosphor-icons/react/dist/ssr'
import { EmptyState } from '~/components/feedback/empty-state'
import { buttonVariants } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export const EventsEmptyState = () => {
  return (
    <EmptyState
      action={
        <Link
          className={cn(buttonVariants({ size: 'lg' }), 'font-mono text-[11px] uppercase tracking-[0.16em]')}
          href='/dashboard/events/new'
        >
          Create your first event
        </Link>
      }
      description='Create your first event and start collecting RSVPs. A shareable page is generated automatically.'
      icon={<CalendarDotsIcon className='size-7' />}
      title='No events yet'
    />
  )
}

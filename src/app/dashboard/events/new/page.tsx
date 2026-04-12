import Link from 'next/link'

import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'

import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import { EventCreateFormCard } from './_components/event-create-form-card'
import { EventCreateIntro } from './_components/event-create-intro'

export default function CreateEventPage() {
  return (
    <div className='space-y-6'>
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'ghost' }),
          'w-fit gap-2 font-mono text-[11px] uppercase tracking-[0.16em]'
        )}
        href='/dashboard'
      >
        <CaretLeftIcon data-icon='inline-start' />
        Back to dashboard
      </Link>

      <section className='grid items-start gap-6 lg:grid-cols-[340px_1fr]'>
        <EventCreateIntro />
        <EventCreateFormCard />
      </section>
    </div>
  )
}

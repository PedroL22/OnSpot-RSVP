import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { AppLink } from '~/components/navigation/app-link'
import { buttonVariants } from '~/components/ui/button'
import { EventCreateFormCard } from './_components/event-create-form-card'
import { EventCreateIntro } from './_components/event-create-intro'

import { cn } from '~/lib/utils'

export default function CreateEventPage() {
  return (
    <div className='space-y-6'>
      <AppLink
        className={cn(
          buttonVariants({ size: 'sm', variant: 'ghost' }),
          'w-fit gap-2 font-mono text-[11px] uppercase tracking-[0.16em]'
        )}
        href='/dashboard'
      >
        <CaretLeftIcon data-icon='inline-start' />
        Back to dashboard
      </AppLink>

      <section className='grid items-start gap-6 lg:grid-cols-[400px_1fr]'>
        <EventCreateIntro />
        <EventCreateFormCard />
      </section>
    </div>
  )
}

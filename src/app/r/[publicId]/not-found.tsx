import Link from 'next/link'

import { EmptyState } from '~/components/feedback/empty-state'
import { PatternBackground } from '~/components/layout/pattern-background'
import { PageThemeToggle } from '~/components/layout/page-theme-toggle'
import { buttonVariants } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export default function PublicEventNotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      <PageThemeToggle />
      <PatternBackground className='opacity-70' />
      <div className='fixed top-0 right-0 left-0 z-50 h-1 bg-primary/80' />

      <div className='relative w-full max-w-xl animate-[scale-in_0.4s_var(--ease-out-expo)_both]'>
        <EmptyState
          action={
            <Link
              className={cn(buttonVariants({ size: 'lg' }), 'font-mono text-[11px] uppercase tracking-[0.16em]')}
              href='/'
            >
              Return home
            </Link>
          }
          description='The link may be incorrect, or the organizer may have removed the event.'
          title='This RSVP page does not exist'
        />
      </div>
    </main>
  )
}

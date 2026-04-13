import Link from 'next/link'

import { EmptyState } from '~/components/feedback/empty-state'
import { PageThemeToggle } from '~/components/layout/page-theme-toggle'
import { PatternBackground } from '~/components/layout/pattern-background'
import { buttonVariants } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export default function RootNotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      <PageThemeToggle />
      <PatternBackground className='opacity-60' variant='grid' />

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
          description='The page may have moved, or the route may not exist in this deployment.'
          title='This page does not exist'
        />
      </div>
    </main>
  )
}

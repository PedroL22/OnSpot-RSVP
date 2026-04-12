'use client'

import Link from 'next/link'

import { ErrorState } from '~/components/feedback/error-state'
import { PatternBackground } from '~/components/layout/pattern-background'
import { buttonVariants } from '~/components/ui/button'

import { cn } from '~/lib/utils'

type RootErrorProps = {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function RootError({ reset }: RootErrorProps) {
  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      <PatternBackground className='opacity-60' variant='grid' />
      <div className='relative w-full max-w-xl animate-[scale-in_0.4s_var(--ease-out-expo)_both]'>
        <ErrorState
          actions={
            <>
              <button
                className={cn(buttonVariants({ size: 'lg' }), 'font-mono text-[11px] uppercase tracking-[0.16em]')}
                onClick={() => reset()}
                type='button'
              >
                Try again
              </button>
              <Link
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'font-mono text-[11px] uppercase tracking-[0.16em]'
                )}
                href='/'
              >
                Return home
              </Link>
            </>
          }
          description='Please try again. If the problem persists, return home and start the flow again.'
          title={
            <>
              This page could not
              <br />
              finish loading
            </>
          }
        />
      </div>
    </main>
  )
}

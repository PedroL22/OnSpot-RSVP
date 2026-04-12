'use client'

import Link from 'next/link'

import { ErrorState } from '~/components/feedback/error-state'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type DashboardErrorProps = {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
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
      description='Please try again. If the problem persists, return to the home page and reopen the dashboard.'
      title={
        <>
          Dashboard could not
          <br />
          finish loading
        </>
      }
    />
  )
}

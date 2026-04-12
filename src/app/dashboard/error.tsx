'use client'

import Link from 'next/link'

type DashboardErrorProps = {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <div className='card-elevated animate-scale-in p-10'>
      <div className='mx-auto max-w-lg text-center'>
        {/* Error icon */}
        <div className='mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-vermillion/10'>
          <svg
            aria-hidden='true'
            className='h-7 w-7 text-vermillion'
            fill='none'
            focusable='false'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
            />
          </svg>
        </div>

        <p className='mb-3 text-label' style={{ color: 'var(--color-danger)' }}>Something went wrong</p>
        <h2 className='mb-4 text-display-md'>
          Dashboard could not
          <br />
          <span className='text-acid'>finish loading</span>
        </h2>
        <p className='mb-8 text-smoke-muted leading-relaxed'>
          Please try again. If the problem persists, return to the home page and reopen the dashboard.
        </p>

        <div className='flex flex-col justify-center gap-3 sm:flex-row'>
          <button className='btn-primary' onClick={() => reset()} type='button'>
            Try again
          </button>
          <Link className='btn-outline' href='/'>
            Return home
          </Link>
        </div>
      </div>
    </div>
  )
}

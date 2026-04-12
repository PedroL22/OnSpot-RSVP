'use client'

import Link from 'next/link'

type RootErrorProps = {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function RootError({ reset }: RootErrorProps) {
  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      {/* Background pattern */}
      <div className='grid-pattern pointer-events-none fixed inset-0 opacity-30' />

      <div className='relative w-full max-w-lg animate-scale-in'>
        <div className='card-elevated p-10 text-center'>
          {/* Error icon */}
          <div className='mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-vermillion/10'>
            <svg
              aria-hidden='true'
              className='h-8 w-8 text-vermillion'
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

          <p className='mb-4 text-label text-vermillion'>Something went wrong</p>
          <h1 className='mb-4 text-display-md'>
            This page could not
            <br />
            <span className='italic'>finish loading</span>
          </h1>
          <p className='mb-8 text-ink-subtle leading-relaxed'>
            Please try again. If the problem persists, return home and start the flow again.
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
    </main>
  )
}

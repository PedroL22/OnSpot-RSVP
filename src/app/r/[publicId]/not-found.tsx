import Link from 'next/link'

export default function PublicEventNotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      {/* Background pattern */}
      <div className='grid-pattern pointer-events-none fixed inset-0 opacity-30' />

      <div className='relative w-full max-w-lg animate-scale-in'>
        <div className='card-elevated p-10 text-center'>
          {/* Not found icon */}
          <div className='mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-sunken'>
            <svg
              aria-hidden='true'
              className='h-8 w-8 text-ink-subtle'
              fill='none'
              focusable='false'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
              />
              <path d='M10 14l2 2 4-4' strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} />
            </svg>
          </div>

          <p className='mb-4 text-label'>Event not found</p>
          <h1 className='mb-4 text-display-md'>
            This RSVP page is
            <br />
            <span className='italic'>no longer available</span>
          </h1>
          <p className='mb-8 text-ink-subtle leading-relaxed'>
            The link may be incorrect, or the organizer may have removed the event.
          </p>

          <Link className='btn-primary inline-flex' href='/'>
            Return home
            <svg
              aria-hidden='true'
              className='h-4 w-4'
              fill='none'
              focusable='false'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M17 8l4 4m0 0l-4 4m4-4H3' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}

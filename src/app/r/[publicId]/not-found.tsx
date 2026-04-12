import Link from 'next/link'

export default function PublicEventNotFound() {
  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      <div className='dot-pattern pointer-events-none fixed inset-0' />
      <div className='fixed top-0 left-0 right-0 z-50 h-0.5 bg-acid opacity-80' />

      <div className='relative w-full max-w-md animate-scale-in'>
        <div className='card-elevated overflow-hidden'>
          <div className='h-0.5 w-full bg-danger' />
          <div className='p-10 text-center'>
            <p className='text-label mb-4' style={{ color: 'var(--color-danger)' }}>404 — Not Found</p>
            <h1 className='text-display-md mb-4 leading-none'>
              This RSVP page
              <br />
              <span className='text-acid'>doesn&apos;t exist</span>
            </h1>
            <p className='mb-8 text-smoke-muted text-sm leading-relaxed'>
              The link may be incorrect, or the organizer may have removed the event.
            </p>

            <Link className='btn-primary inline-flex' href='/'>
              Return home →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

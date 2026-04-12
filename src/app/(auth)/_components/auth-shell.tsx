import Link from 'next/link'
import type { ReactNode } from 'react'

type AuthShellProps = {
  alternateHref: string
  alternateLabel: string
  alternateText: string
  children: ReactNode
  description: string
  title: string
}

export const AuthShell = ({
  alternateHref,
  alternateLabel,
  alternateText,
  children,
  description,
  title,
}: AuthShellProps) => {
  return (
    <main className='flex min-h-screen'>
      {/* Left panel - Branding */}
      <div className='relative hidden overflow-hidden bg-ink lg:flex lg:w-1/2'>
        {/* Decorative elements */}
        <div className='diagonal-lines absolute inset-0 opacity-20' />
        <div className='absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-bl from-vermillion/20 to-transparent blur-3xl' />
        <div className='absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-tr from-paper/10 to-transparent blur-2xl' />

        {/* Grid pattern overlay */}
        <div className='grid-pattern absolute inset-0 opacity-5' />

        <div className='relative z-10 flex w-full flex-col justify-between p-12'>
          {/* Logo */}
          <Link className='group flex items-center gap-3' href='/'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-paper/10 bg-paper/10 transition-all duration-300 group-hover:bg-paper/15'>
              <svg
                aria-hidden='true'
                className='h-5 w-5 text-paper'
                fill='currentColor'
                focusable='false'
                viewBox='0 0 24 24'
              >
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
            <span className='font-semibold text-paper tracking-tight'>OnSpot</span>
          </Link>

          {/* Main content */}
          <div className='space-y-8'>
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-2'>
                <span className='h-1.5 w-1.5 rounded-full bg-vermillion' />
                <span className='text-label text-paper/50'>Authentication</span>
              </div>

              <h1 className='max-w-md text-display-xl text-paper'>{title}</h1>

              <p className='max-w-md text-lg text-paper/60 leading-relaxed'>{description}</p>
            </div>

            {/* Feature highlights */}
            <div className='grid max-w-md gap-4'>
              <div className='rounded-xl border border-paper/10 bg-paper/5 p-5'>
                <p className='mb-2 text-label text-paper/40'>Fast path</p>
                <p className='font-medium text-paper'>Email and password work out of the box</p>
              </div>
              <div className='rounded-xl border border-paper/10 bg-paper/5 p-5'>
                <p className='mb-2 text-label text-paper/40'>Flexible entry</p>
                <p className='font-medium text-paper'>GitHub appears when OAuth keys exist</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className='text-paper/40 text-sm'>Secure authentication powered by Better Auth</p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className='flex flex-1 items-center justify-center p-6 lg:p-12'>
        {/* Subtle background pattern */}
        <div className='grid-pattern pointer-events-none fixed inset-0 opacity-30 lg:left-1/2' />

        <div className='relative w-full max-w-md animate-fade-up space-y-8'>
          {/* Mobile logo */}
          <div className='lg:hidden'>
            <Link className='mb-8 flex items-center gap-3' href='/'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-ink'>
                <svg
                  aria-hidden='true'
                  className='h-5 w-5 text-paper'
                  fill='currentColor'
                  focusable='false'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                </svg>
              </div>
              <span className='font-semibold text-ink tracking-tight'>OnSpot</span>
            </Link>
          </div>

          {/* Form header */}
          <div className='space-y-2'>
            <p className='text-label'>Authentication</p>
            <p className='text-ink-subtle leading-relaxed'>
              Keep the browser session thin and let Better Auth handle the account lifecycle on the server.
            </p>
          </div>

          {/* Form content */}
          <div className='space-y-6'>{children}</div>

          {/* Alternate link */}
          <div className='border-border border-t pt-6'>
            <p className='text-ink-subtle text-sm'>
              {alternateLabel}{' '}
              <Link className='font-semibold text-ink transition-colors hover:text-vermillion' href={alternateHref}>
                {alternateText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

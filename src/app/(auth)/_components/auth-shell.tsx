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

      {/* ── Left panel — Branding ──────────────────────────── */}
      <div className='relative hidden overflow-hidden lg:flex lg:w-[45%] xl:w-[42%]'
        style={{ background: 'var(--color-void-raised)' }}>

        {/* Grid bg */}
        <div className='grid-pattern absolute inset-0' />

        {/* Acid glow */}
        <div className='pointer-events-none absolute top-0 left-0 h-96 w-96'
          style={{ background: 'radial-gradient(circle at 20% 20%, rgba(201,255,0,0.08) 0%, transparent 60%)' }} />

        {/* Acid line right edge */}
        <div className='absolute right-0 top-0 bottom-0 w-px bg-acid opacity-30' />

        <div className='relative z-10 flex w-full flex-col justify-between p-12 xl:p-16'>
          {/* Logo */}
          <Link className='group flex items-center gap-2.5' href='/'>
            <div className='flex h-8 w-8 items-center justify-center rounded bg-acid transition-colors group-hover:bg-acid-dim'>
              <svg aria-hidden='true' className='h-4 w-4' fill='currentColor' focusable='false' viewBox='0 0 24 24'
                style={{ filter: 'invert(1)' }}>
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
            <span className='font-mono text-[11px] uppercase tracking-widest text-smoke'>OnSpot</span>
          </Link>

          {/* Main content */}
          <div className='space-y-8'>
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-2'>
                <span className='h-1.5 w-1.5 rounded-full bg-acid' />
                <span className='text-label text-acid' style={{ color: 'var(--color-acid)', opacity: 0.7 }}>
                  Authentication
                </span>
              </div>

              <h1 className='text-display-xl max-w-xs'>{title}</h1>

              <p className='max-w-xs text-smoke-muted leading-relaxed' style={{ fontSize: '0.9375rem' }}>
                {description}
              </p>
            </div>

            {/* Feature highlights */}
            <div className='space-y-3 max-w-xs'>
              <div className='rounded border border-border bg-void p-4'>
                <p className='text-label mb-1.5' style={{ color: 'rgba(201,255,0,0.5)' }}>Fast path</p>
                <p className='text-sm text-smoke'>Email and password work out of the box</p>
              </div>
              <div className='rounded border border-border bg-void p-4'>
                <p className='text-label mb-1.5' style={{ color: 'rgba(201,255,0,0.5)' }}>Flexible entry</p>
                <p className='text-sm text-smoke'>GitHub appears when OAuth keys exist</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className='font-mono text-[10px] uppercase tracking-wider text-smoke-dim'>
            Secure auth — Better Auth
          </p>
        </div>
      </div>

      {/* ── Right panel — Form ─────────────────────────────── */}
      <div className='flex flex-1 flex-col items-center justify-center p-6 lg:p-12'>
        {/* Subtle dot bg */}
        <div className='dot-pattern pointer-events-none fixed inset-0' />

        <div className='relative w-full max-w-md animate-fade-up'>

          {/* Mobile logo */}
          <div className='mb-10 lg:hidden'>
            <Link className='flex items-center gap-2.5' href='/'>
              <div className='flex h-8 w-8 items-center justify-center rounded bg-acid'>
                <svg aria-hidden='true' className='h-4 w-4' fill='currentColor' focusable='false' viewBox='0 0 24 24'
                  style={{ filter: 'invert(1)' }}>
                  <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                </svg>
              </div>
              <span className='font-mono text-[11px] uppercase tracking-widest text-smoke'>OnSpot</span>
            </Link>
          </div>

          {/* Card */}
          <div className='card-elevated overflow-hidden'>
            {/* Acid top strip */}
            <div className='h-0.5 w-full bg-acid' />

            <div className='p-8'>
              {/* Form header */}
              <div className='mb-8 space-y-3'>
                <p className='text-label'>Account access</p>
                <p className='text-smoke-muted text-sm leading-relaxed'>
                  {description}
                </p>
              </div>

              {/* Form content */}
              <div className='space-y-6'>{children}</div>

              {/* Alternate link */}
              <div className='mt-8 border-t border-border pt-6'>
                <p className='font-mono text-[11px] text-smoke-muted'>
                  {alternateLabel}{' '}
                  <Link
                    className='font-medium text-acid transition-opacity hover:opacity-80'
                    href={alternateHref}
                  >
                    {alternateText}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

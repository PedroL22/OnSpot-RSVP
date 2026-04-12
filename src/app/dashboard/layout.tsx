import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

import { signOut } from '~/app/(auth)/actions'
import { getSession } from '~/server/better-auth/server'

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/sign-in?callbackURL=/dashboard')
  }

  return (
    <div className='min-h-screen'>
      {/* Dot pattern bg */}
      <div className='dot-pattern pointer-events-none fixed inset-0 opacity-100' />

      {/* Top acid line */}
      <div className='fixed top-0 left-0 right-0 z-50 h-px bg-acid' style={{ opacity: 0.8 }} />

      {/* Header */}
      <header className='sticky top-0 z-40 border-b border-border bg-void/90 backdrop-blur-sm'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10'>

          {/* Left — Logo + nav */}
          <div className='flex items-center gap-6'>
            <Link className='group flex items-center gap-2.5' href='/dashboard'>
              <div className='flex h-7 w-7 items-center justify-center rounded bg-acid transition-colors group-hover:bg-acid-dim'>
                <svg aria-hidden='true' className='h-4 w-4' fill='currentColor' focusable='false' viewBox='0 0 24 24'
                  style={{ filter: 'invert(1)' }}>
                  <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                </svg>
              </div>
              <div className='hidden sm:block'>
                <p className='font-mono text-[11px] font-medium uppercase tracking-widest text-smoke'>OnSpot</p>
              </div>
            </Link>

            {/* Divider */}
            <div className='hidden h-4 w-px bg-border-strong md:block' />

            <nav className='hidden items-center gap-0.5 md:flex'>
              <Link
                className='rounded px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-smoke-muted transition-colors hover:bg-void-surface hover:text-smoke'
                href='/dashboard'
              >
                Events
              </Link>
              <Link
                className='rounded px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-smoke-muted transition-colors hover:bg-void-surface hover:text-smoke'
                href='/dashboard/events/new'
              >
                + New
              </Link>
            </nav>
          </div>

          {/* Right — User info + sign out */}
          <div className='flex items-center gap-3'>
            <div className='hidden items-center gap-2 rounded border border-border bg-void-surface px-3 py-1.5 sm:flex'>
              <span className='block h-1.5 w-1.5 rounded-full bg-success' />
              <span className='font-mono text-[11px] text-smoke-muted'>
                {session.user.name}
              </span>
            </div>

            <form action={signOut}>
              <button className='btn-ghost px-3 py-1.5 font-mono text-[11px]' type='submit'>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className='relative mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10'>
        <div className='animate-fade-up'>{children}</div>
      </main>
    </div>
  )
}

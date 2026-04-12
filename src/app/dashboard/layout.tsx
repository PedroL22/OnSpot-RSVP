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
    <main className='min-h-screen'>
      {/* Subtle grid background */}
      <div className='grid-pattern pointer-events-none fixed inset-0 opacity-30' />

      <div className='relative mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-8'>
        {/* Header */}
        <header className='flex animate-fade-up items-center justify-between py-2'>
          <div className='flex items-center gap-6'>
            <Link className='group flex items-center gap-3' href='/dashboard'>
              <div className='relative flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-paper transition-transform duration-300 group-hover:scale-105'>
                <svg aria-hidden='true' className='h-5 w-5' fill='currentColor' focusable='false' viewBox='0 0 24 24'>
                  <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                </svg>
              </div>
              <div className='hidden sm:block'>
                <p className='font-semibold text-ink leading-none tracking-tight'>OnSpot</p>
                <p className='mt-0.5 text-[10px] text-ink-subtle uppercase tracking-wider'>Dashboard</p>
              </div>
            </Link>

            <nav className='hidden items-center gap-1 md:flex'>
              <Link
                className='rounded-md px-3 py-1.5 text-ink-subtle text-sm transition-colors hover:bg-surface-sunken hover:text-ink'
                href='/dashboard'
              >
                Events
              </Link>
              <Link
                className='rounded-md px-3 py-1.5 text-ink-subtle text-sm transition-colors hover:bg-surface-sunken hover:text-ink'
                href='/dashboard/events/new'
              >
                Create new
              </Link>
            </nav>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden items-center gap-2 rounded-lg bg-surface-sunken px-3 py-1.5 sm:flex'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-emerald' />
              <span className='text-ink-subtle text-sm'>
                <span className='font-medium text-ink'>{session.user.name}</span>
              </span>
            </div>

            <form action={signOut}>
              <button className='btn-ghost text-ink-subtle text-sm hover:text-ink' type='submit'>
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* Main content */}
        <div className='animation-delay-100 mt-8 animate-fade-up'>{children}</div>
      </div>
    </main>
  )
}

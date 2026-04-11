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
    <main className='min-h-screen bg-[#f6efe5] px-6 py-8 text-[#111827] sm:px-8 lg:px-10'>
      <div className='mx-auto flex min-h-screen max-w-7xl flex-col gap-8'>
        <header className='flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white px-6 py-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-1'>
            <Link className='font-black text-2xl tracking-[-0.04em]' href='/dashboard'>
              OnSpot RSVP
            </Link>
            <p className='text-slate-600 text-sm'>Manage guest lists, public RSVP pages, and day-of check-in.</p>
          </div>

          <div className='flex items-center gap-3'>
            <div className='rounded-full bg-[#faf7f2] px-4 py-2 text-slate-600 text-sm'>
              Signed in as <span className='font-semibold text-[#111827]'>{session.user.name}</span>
            </div>
            <form action={signOut}>
              <button
                className='inline-flex items-center justify-center rounded-full bg-[#111827] px-5 py-2 font-medium text-sm text-white transition hover:bg-[#1f2937]'
                type='submit'
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        {children}
      </div>
    </main>
  )
}

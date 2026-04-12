import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

import { signOut } from '~/app/(auth)/actions'
import { PatternBackground } from '~/components/layout/pattern-background'
import { getSession } from '~/server/better-auth/server'

import { DashboardHeader } from './_components/dashboard-header'

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/sign-in?callbackURL=/dashboard')
  }

  return (
    <div className='min-h-screen'>
      <PatternBackground className='opacity-70' />
      <div className='fixed top-0 right-0 left-0 z-50 h-px bg-primary/70' />

      <DashboardHeader onSignOut={signOut} userName={session.user.name} />

      <main className='relative mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10'>
        <div className='animate-[fade-up_0.5s_var(--ease-out-expo)_both]'>{children}</div>
      </main>
    </div>
  )
}

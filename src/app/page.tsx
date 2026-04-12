import Image from 'next/image'
import Link from 'next/link'

import { signOut } from '~/app/(auth)/actions'
import { getSession } from '~/server/better-auth/server'

export default async function Home() {
  const session = await getSession()

  return (
    <main className='min-h-screen'>
      {/* Decorative grid background */}
      <div className='grid-pattern pointer-events-none fixed inset-0 opacity-50' />

      <div className='relative mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12'>
        {/* Header */}
        <header className='flex animate-fade-up items-center justify-between'>
          <Link className='group flex items-center gap-3' href='/'>
            <div className='relative flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-paper transition-transform duration-300 group-hover:scale-105'>
              <Image alt='OnSpot RSVP' className='h-6 w-6' height={24} priority src='/logo.svg' width={24} />
            </div>
            <span className='font-semibold text-ink tracking-tight'>OnSpot</span>
          </Link>

          {session?.user ? (
            <div className='flex items-center gap-3'>
              <span className='hidden text-ink-subtle text-sm sm:inline'>{session.user.email}</span>
              <form action={signOut}>
                <button className='btn-ghost text-sm' type='submit'>
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <nav className='flex items-center gap-2'>
              <Link className='btn-ghost text-sm' href='/sign-in'>
                Sign in
              </Link>
              <Link className='btn-primary text-sm' href='/sign-up'>
                Get started
              </Link>
            </nav>
          )}
        </header>

        {/* Main content */}
        <div className='mt-16 grid items-start gap-8 lg:mt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12'>
          {/* Left column - Hero */}
          <div className='animation-delay-100 animate-fade-up space-y-10'>
            {/* Tagline */}
            <div className='inline-flex items-center gap-2 rounded-full border border-vermillion/10 bg-vermillion/5 px-3 py-1.5'>
              <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-vermillion' />
              <span className='font-medium text-vermillion text-xs tracking-wide'>Event check-in reimagined</span>
            </div>

            {/* Main heading */}
            <div className='space-y-6'>
              <h1 className='text-display-xl'>
                The space between <span className='italic'>share link</span>
                <br />
                and <span className='italic'>check-in</span>
              </h1>

              <p className='max-w-lg text-ink-subtle text-lg leading-relaxed'>
                One elegant system for RSVP pages, guest management, waitlists, and day-of arrivals. No bloated event
                platforms, no learning curve.
              </p>
            </div>

            {/* Feature blocks - Ticket stub aesthetic */}
            <div className='grid gap-4 sm:grid-cols-3'>
              <div className='group relative overflow-hidden rounded-xl bg-ink p-5 text-paper transition-transform duration-300 hover:-translate-y-1'>
                <div className='ticket-edge-right absolute top-0 right-0 h-full w-8 opacity-10' />
                <p className='mb-3 text-label text-paper/50'>01</p>
                <p className='font-medium'>Public RSVP pages</p>
                <p className='mt-2 text-paper/60 text-sm'>Share a link, collect responses</p>
              </div>

              <div className='group relative overflow-hidden rounded-xl bg-ink p-5 text-paper transition-transform duration-300 hover:-translate-y-1'>
                <div className='ticket-edge-right absolute top-0 right-0 h-full w-8 opacity-10' />
                <p className='mb-3 text-label text-paper/50'>02</p>
                <p className='font-medium'>Waitlist automation</p>
                <p className='mt-2 text-paper/60 text-sm'>Capacity limits that work</p>
              </div>

              <div className='group relative overflow-hidden rounded-xl bg-ink p-5 text-paper transition-transform duration-300 hover:-translate-y-1'>
                <div className='ticket-edge-right absolute top-0 right-0 h-full w-8 opacity-10' />
                <p className='mb-3 text-label text-paper/50'>03</p>
                <p className='font-medium'>Day-of check-in</p>
                <p className='mt-2 text-paper/60 text-sm'>One tap arrivals</p>
              </div>
            </div>

            {/* Tech stack pill */}
            <div className='flex flex-wrap items-center gap-2 text-ink-subtle text-xs'>
              <span>Built with</span>
              {['Next.js 15', 'React 19', 'Prisma', 'Better Auth'].map((tech) => (
                <span className='rounded-full bg-surface-sunken px-2.5 py-1 font-medium' key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right column - Auth card */}
          <div className='animation-delay-200 animate-fade-up'>
            <div className='card-elevated p-8 lg:p-10'>
              {session?.user ? (
                <div className='space-y-8'>
                  {/* Welcome state */}
                  <div className='space-y-4'>
                    <div className='inline-flex items-center gap-2 rounded-full bg-emerald/10 px-2.5 py-1'>
                      <span className='h-1.5 w-1.5 rounded-full bg-emerald' />
                      <span className='font-semibold text-emerald-dim text-xs uppercase tracking-wider'>
                        Session active
                      </span>
                    </div>

                    <h2 className='text-display-md'>
                      Welcome back,
                      <br />
                      <span className='italic'>{session.user.name}</span>
                    </h2>

                    <p className='text-ink-subtle leading-relaxed'>
                      Your event dashboard is ready. Manage RSVPs, handle waitlists, and run check-in from one place.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className='space-y-3'>
                    <Link className='btn-accent w-full justify-center' href='/dashboard'>
                      Open dashboard
                      <svg
                        aria-hidden='true'
                        className='h-4 w-4'
                        fill='none'
                        focusable='false'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          d='M17 8l4 4m0 0l-4 4m4-4H3'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                        />
                      </svg>
                    </Link>

                    <form action={signOut}>
                      <button className='btn-outline w-full justify-center' type='submit'>
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className='space-y-8'>
                  {/* Auth header */}
                  <div className='space-y-4'>
                    <p className='text-label'>Get started</p>

                    <h2 className='text-display-md'>
                      Create your
                      <br />
                      <span className='italic'>organizer</span> account
                    </h2>

                    <p className='text-ink-subtle leading-relaxed'>
                      Sign up with email or connect via GitHub. Your first event is one form away.
                    </p>
                  </div>

                  {/* Auth options */}
                  <div className='space-y-4'>
                    <Link
                      className='group block rounded-xl border border-border p-5 transition-all duration-200 hover:border-ink hover:shadow-md'
                      href='/sign-up'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <p className='text-label'>New here</p>
                          <p className='font-medium text-ink'>Create an account</p>
                        </div>
                        <span className='text-ink-subtle text-xl transition-transform duration-200 group-hover:translate-x-1'>
                          &rarr;
                        </span>
                      </div>
                    </Link>

                    <Link
                      className='group block rounded-xl border border-transparent bg-surface-sunken p-5 transition-all duration-200 hover:border-border hover:bg-surface-elevated'
                      href='/sign-in'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <p className='text-label'>Returning</p>
                          <p className='font-medium text-ink'>Sign in to continue</p>
                        </div>
                        <span className='text-ink-subtle text-xl transition-transform duration-200 group-hover:translate-x-1'>
                          &rarr;
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Trust indicator */}
                  <div className='border-border border-t pt-6'>
                    <p className='text-center text-ink-subtle text-xs'>
                      No credit card required. Free for personal events.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer accent line */}
        <div className='animation-delay-400 mt-24 flex animate-fade-up items-center gap-4'>
          <div className='h-px flex-1 bg-gradient-to-r from-transparent via-border-strong to-transparent' />
          <span className='text-ink-subtle text-xs uppercase tracking-widest'>OnSpot RSVP</span>
          <div className='h-px flex-1 bg-gradient-to-r from-transparent via-border-strong to-transparent' />
        </div>
      </div>
    </main>
  )
}

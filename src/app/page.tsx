import Image from 'next/image'
import Link from 'next/link'

import { signOut } from '~/app/(auth)/actions'
import { getSession } from '~/server/better-auth/server'

export default async function Home() {
  const session = await getSession()

  return (
    <main className='relative min-h-screen overflow-hidden'>
      {/* Background grid */}
      <div className='dot-pattern pointer-events-none fixed inset-0 opacity-100' />

      {/* Acid glow top-right */}
      <div
        className='pointer-events-none fixed top-0 right-0 h-[500px] w-[500px]'
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(201,255,0,0.07) 0%, transparent 60%)',
        }}
      />

      <div className='relative mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10'>

        {/* ── Header ─────────────────────────────────────────── */}
        <header className='flex animate-fade-in items-center justify-between'>
          <Link className='group flex items-center gap-3' href='/'>
            <div className='flex h-9 w-9 items-center justify-center rounded bg-acid transition-all duration-200 group-hover:bg-acid-dim'>
              <Image alt='OnSpot RSVP' className='h-5 w-5' height={20} priority src='/logo.svg' width={20} style={{ filter: 'invert(1)' }} />
            </div>
            <span
              className='text-smoke font-mono text-sm font-medium tracking-widest uppercase'
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              OnSpot
            </span>
          </Link>

          {session?.user ? (
            <div className='flex items-center gap-3'>
              <span className='hidden font-mono text-smoke-muted text-xs sm:inline'>{session.user.email}</span>
              <form action={signOut}>
                <button className='btn-ghost text-xs' type='submit'>Sign out</button>
              </form>
            </div>
          ) : (
            <nav className='flex items-center gap-2'>
              <Link className='btn-ghost text-xs' href='/sign-in'>Sign in</Link>
              <Link className='btn-primary text-xs' href='/sign-up'>Get started</Link>
            </nav>
          )}
        </header>

        {/* ── Hero ───────────────────────────────────────────── */}
        <div className='mt-16 grid items-start gap-10 lg:mt-20 lg:grid-cols-[1fr_420px] lg:gap-16'>

          {/* Left — Headline + features */}
          <div className='animate-fade-up space-y-12'>

            {/* Live indicator */}
            <div className='inline-flex items-center gap-2.5 rounded border border-border px-3 py-1.5'
              style={{ background: 'rgba(201,255,0,0.06)' }}>
              <span className='block h-1.5 w-1.5 rounded-full bg-acid animate-pulse' />
              <span className='font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-acid'>
                Live event check-in platform
              </span>
            </div>

            {/* Main heading */}
            <div>
              <h1 className='text-display-xl leading-none'>
                The sharpest
                <br />
                <span className='text-acid'>RSVP</span> system
                <br />
                you&apos;ll deploy.
              </h1>
              <p className='mt-6 max-w-lg text-smoke-muted leading-relaxed' style={{ fontSize: '1.0625rem' }}>
                One link. Instant RSVPs. Real-time check-in.
                Waitlist automation that doesn't need a tutorial.
              </p>
            </div>

            {/* Feature rows — numbered list style */}
            <div className='space-y-0 border border-border rounded divide-y divide-border overflow-hidden'>
              {[
                { n: '01', title: 'Public RSVP pages', desc: 'Share a link — guests fill in, you see it instantly.' },
                { n: '02', title: 'Waitlist automation', desc: 'Hit capacity? Overflow goes to waitlist. Auto-promote.' },
                { n: '03', title: 'Day-of check-in', desc: 'One tap. Guest confirmed. Zero friction.' },
              ].map(({ n, title, desc }) => (
                <div className='flex items-center gap-6 px-5 py-4 transition-colors hover:bg-void-surface group' key={n}>
                  <span className='font-mono text-[11px] text-smoke-dim tabular-nums shrink-0'>{n}</span>
                  <div className='min-w-0'>
                    <p className='font-medium text-smoke text-sm'>{title}</p>
                    <p className='text-smoke-muted text-xs mt-0.5'>{desc}</p>
                  </div>
                  <span className='ml-auto text-acid opacity-0 group-hover:opacity-100 transition-opacity text-sm'>→</span>
                </div>
              ))}
            </div>

            {/* Stack pills */}
            <div className='flex flex-wrap items-center gap-2'>
              <span className='font-mono text-[10px] text-smoke-dim uppercase tracking-wider'>Built with</span>
              {['Next.js 15', 'React 19', 'Prisma', 'Better Auth'].map((tech) => (
                <span
                  className='rounded border border-border px-2.5 py-1 font-mono text-[10px] text-smoke-muted uppercase tracking-wider'
                  key={tech}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Auth card */}
          <div className='animation-delay-200 animate-fade-up'>
            <div className='card-elevated overflow-hidden'>
              {/* Acid top accent */}
              <div className='h-0.5 w-full bg-acid' />

              <div className='p-8'>
                {session?.user ? (
                  <div className='space-y-8'>
                    {/* Welcome state */}
                    <div className='space-y-4'>
                      <div className='flex items-center gap-2'>
                        <span className='h-1.5 w-1.5 rounded-full bg-success' />
                        <span className='font-mono text-[10px] uppercase tracking-[0.2em] text-success'>Session active</span>
                      </div>
                      <h2 className='text-display-md'>
                        Welcome back,
                        <br />
                        <span className='text-acid'>{session.user.name}</span>
                      </h2>
                      <p className='text-smoke-muted text-sm leading-relaxed'>
                        Your event dashboard is ready. Manage RSVPs, handle waitlists, and run check-in from one place.
                      </p>
                    </div>

                    <div className='space-y-3'>
                      <Link className='btn-primary w-full justify-center' href='/dashboard'>
                        Open dashboard
                        <svg aria-hidden='true' className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path d='M17 8l4 4m0 0l-4 4m4-4H3' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
                        </svg>
                      </Link>
                      <form action={signOut}>
                        <button className='btn-outline w-full justify-center' type='submit'>Sign out</button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-8'>
                    {/* Header */}
                    <div className='space-y-3'>
                      <p className='text-label'>Get started</p>
                      <h2 className='text-display-md'>
                        Create your
                        <br />
                        <span className='text-acid'>organizer</span> account
                      </h2>
                      <p className='text-smoke-muted text-sm leading-relaxed'>
                        Sign up with email or connect via GitHub. Your first event is one form away.
                      </p>
                    </div>

                    {/* Auth options */}
                    <div className='space-y-3'>
                      <Link
                        className='group flex items-center justify-between rounded border border-border p-4 transition-all duration-150 hover:border-acid hover:bg-acid-faint'
                        href='/sign-up'
                      >
                        <div>
                          <p className='font-mono text-[10px] uppercase tracking-[0.15em] text-smoke-muted'>New here</p>
                          <p className='mt-1 font-medium text-smoke text-sm'>Create an account</p>
                        </div>
                        <span className='text-smoke-muted transition-all duration-150 group-hover:text-acid group-hover:translate-x-0.5'>→</span>
                      </Link>

                      <Link
                        className='group flex items-center justify-between rounded border border-border bg-void-surface p-4 transition-all duration-150 hover:border-border-strong'
                        href='/sign-in'
                      >
                        <div>
                          <p className='font-mono text-[10px] uppercase tracking-[0.15em] text-smoke-muted'>Returning</p>
                          <p className='mt-1 font-medium text-smoke text-sm'>Sign in to continue</p>
                        </div>
                        <span className='text-smoke-muted transition-transform duration-150 group-hover:translate-x-0.5'>→</span>
                      </Link>
                    </div>

                    <div className='border-t border-border pt-5'>
                      <p className='font-mono text-center text-[10px] uppercase tracking-wider text-smoke-dim'>
                        No credit card required · Free for personal events
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className='animation-delay-400 mt-24 animate-fade-up flex items-center gap-4'>
          <div className='h-px flex-1' style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))' }} />
          <span className='font-mono text-[9px] uppercase tracking-[0.3em] text-smoke-dim'>OnSpot RSVP</span>
          <div className='h-px flex-1' style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
        </div>
      </div>
    </main>
  )
}

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
    <main className='min-h-screen bg-[#f6efe5] px-6 py-10 text-[#111827] sm:px-8 lg:px-10'>
      <div className='mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]'>
        <section className='relative overflow-hidden rounded-[2rem] bg-[#111827] p-8 text-white shadow-[0_24px_80px_rgba(17,24,39,0.24)] sm:p-12'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_32%)]' />
          <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%,transparent_62%,rgba(255,255,255,0.03))]' />
          <div className='relative flex h-full flex-col justify-between gap-10'>
            <div className='space-y-6'>
              <Link
                className='inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-1 text-[#fbbf24] text-xs uppercase tracking-[0.28em]'
                href='/'
              >
                OnSpot RSVP
              </Link>
              <div className='max-w-xl space-y-5'>
                <h1 className='font-black text-5xl tracking-[-0.04em] sm:text-6xl'>{title}</h1>
                <p className='text-base text-slate-300 leading-7 sm:text-lg'>{description}</p>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm'>
                <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Fast path</p>
                <p className='mt-3 font-semibold text-lg'>Email and password work out of the box.</p>
              </div>
              <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm'>
                <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Flexible entry</p>
                <p className='mt-3 font-semibold text-lg'>GitHub appears automatically when the OAuth keys exist.</p>
              </div>
            </div>
          </div>
        </section>

        <section className='flex rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10'>
          <div className='flex w-full flex-col justify-between gap-8'>
            <div className='space-y-3'>
              <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>Authentication</p>
              <p className='max-w-lg text-base text-slate-600 leading-7'>
                Keep the browser session thin and let Better Auth handle the account lifecycle on the server.
              </p>
            </div>

            {children}

            <p className='text-slate-500 text-sm'>
              {alternateLabel}{' '}
              <Link
                className='font-semibold text-[#111827] underline decoration-[#f59e0b]/60 underline-offset-4'
                href={alternateHref}
              >
                {alternateText}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

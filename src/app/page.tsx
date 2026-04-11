import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { LatestPost } from '~/components/post'

import { auth } from '~/server/better-auth'
import { getSession } from '~/server/better-auth/server'
import { db } from '~/server/db'
import { tryCatch } from '~/utils/try-catch'

export default async function Home() {
  const session = await getSession()

  const { data: latestPost } = session?.user
    ? await tryCatch(
        db.post.findFirst({
          orderBy: { createdAt: 'desc' },
          where: { createdById: session.user.id },
        })
      )
    : { data: null }

  return (
    <main className='min-h-screen bg-[#f6efe5] text-[#1f2937]'>
      <div className='mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16'>
        <div className='grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]'>
          <section className='relative overflow-hidden rounded-[2rem] bg-[#111827] p-8 text-white shadow-[0_24px_80px_rgba(17,24,39,0.28)] sm:p-12'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_32%)]' />
            <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,transparent_62%,rgba(255,255,255,0.06))]' />
            <div className='relative flex flex-col gap-8'>
              <div className='inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-3 text-xs uppercase tracking-[0.28em]'>
                <Image alt='OnSpot RSVP logo' className='h-auto w-9' height={39} priority src='/logo.svg' width={50} />
                <span className='text-[#fbbf24]'>OnSpot RSVP</span>
              </div>
              <div className='max-w-2xl space-y-5'>
                <h1 className='max-w-xl font-black text-5xl tracking-[-0.04em] sm:text-6xl'>
                  Run RSVP and check-in without a bloated dashboard.
                </h1>
                <p className='max-w-xl text-base text-slate-300 leading-7 sm:text-lg'>
                  Keep the guest list tight, switch from sign-up to check-in fast, and leave the admin work on the
                  server where it belongs.
                </p>
              </div>
              <div className='grid gap-4 sm:grid-cols-3'>
                <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm'>
                  <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Flow</p>
                  <p className='mt-2 font-semibold text-lg'>Email or GitHub login</p>
                </div>
                <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm'>
                  <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Stack</p>
                  <p className='mt-2 font-semibold text-lg'>Next.js + Better Auth + Prisma</p>
                </div>
                <div className='rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm'>
                  <p className='text-slate-400 text-sm uppercase tracking-[0.22em]'>Database</p>
                  <p className='mt-2 font-semibold text-lg'>Supabase Postgres</p>
                </div>
              </div>
            </div>
          </section>

          <section className='rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10'>
            {session?.user ? (
              <div className='flex flex-col gap-8'>
                <div className='space-y-3'>
                  <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>Session Active</p>
                  <h2 className='font-bold text-3xl text-[#111827] tracking-[-0.03em]'>
                    Logged in as {session.user.name}
                  </h2>
                  <p className='text-base text-slate-600'>You can create a post now or sign out to switch accounts.</p>
                </div>

                <form>
                  <button
                    className='inline-flex w-full items-center justify-center rounded-full bg-[#111827] px-6 py-3 font-semibold text-white transition hover:bg-[#1f2937]'
                    formAction={async () => {
                      'use server'

                      const { error } = await tryCatch(
                        auth.api.signOut({
                          headers: await headers(),
                        })
                      )

                      if (error) {
                        return
                      }

                      redirect('/')
                    }}
                    type='submit'
                  >
                    Sign out
                  </button>
                </form>

                <LatestPost latestPost={latestPost ?? null} />
              </div>
            ) : (
              <div className='flex flex-col gap-8'>
                <div className='space-y-3'>
                  <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>Authentication</p>
                  <h2 className='font-bold text-3xl text-[#111827] tracking-[-0.03em]'>
                    Choose how you want to enter.
                  </h2>
                  <p className='text-base text-slate-600 leading-7'>
                    Create an account with email and password or jump back in with the credentials you already have.
                  </p>
                </div>

                <div className='grid gap-4'>
                  <Link
                    className='group rounded-[1.5rem] border border-[#111827]/10 bg-[#faf7f2] p-5 transition hover:border-[#111827]/20 hover:bg-[#f6efe5]'
                    href='/sign-up'
                  >
                    <p className='text-slate-500 text-sm uppercase tracking-[0.22em]'>Create account</p>
                    <div className='mt-3 flex items-center justify-between gap-4'>
                      <p className='font-semibold text-[#111827] text-xl'>Start with email and password</p>
                      <span className='text-2xl transition group-hover:translate-x-1'>&rarr;</span>
                    </div>
                  </Link>
                  <Link
                    className='group rounded-[1.5rem] border border-[#111827]/10 bg-white p-5 transition hover:border-[#111827]/20 hover:bg-[#faf7f2]'
                    href='/sign-in'
                  >
                    <p className='text-slate-500 text-sm uppercase tracking-[0.22em]'>Existing account</p>
                    <div className='mt-3 flex items-center justify-between gap-4'>
                      <p className='font-semibold text-[#111827] text-xl'>Sign in and continue managing guests</p>
                      <span className='text-2xl transition group-hover:translate-x-1'>&rarr;</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'

type RootErrorProps = {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function RootError({ reset }: RootErrorProps) {
  return (
    <main className='min-h-screen bg-[#f6efe5] px-6 py-10 text-[#111827] sm:px-8 lg:px-10'>
      <div className='mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center'>
        <div className='w-full rounded-[2rem] border border-red-200 bg-white p-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
          <p className='text-red-600 text-sm uppercase tracking-[0.28em]'>Something went wrong</p>
          <h1 className='mt-4 font-bold text-4xl tracking-[-0.04em]'>This page could not finish loading.</h1>
          <p className='mt-4 text-slate-600 leading-7'>
            Please try again. If the problem keeps happening, return home and start the flow again.
          </p>
          <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
            <button
              className='inline-flex items-center justify-center rounded-full bg-[#111827] px-6 py-3 font-semibold text-white transition hover:bg-[#1f2937]'
              onClick={() => reset()}
              type='button'
            >
              Try again
            </button>
            <Link
              className='inline-flex items-center justify-center rounded-full border border-[#111827]/10 bg-[#faf7f2] px-6 py-3 font-semibold text-[#111827] transition hover:border-[#111827]/20 hover:bg-white'
              href='/'
            >
              Return home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

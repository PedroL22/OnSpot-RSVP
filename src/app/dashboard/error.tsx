'use client'

type DashboardErrorProps = {
  error: Error & {
    digest?: string
  }
  reset: () => void
}

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <div className='rounded-[2rem] border border-red-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
      <div className='max-w-xl space-y-4'>
        <p className='text-red-600 text-sm uppercase tracking-[0.28em]'>Something went wrong</p>
        <h2 className='font-bold text-3xl tracking-[-0.03em]'>The dashboard could not finish loading.</h2>
        <p className='text-slate-600 leading-7'>
          Please try again. If the problem keeps happening, return to the home page and reopen the dashboard.
        </p>
        <button
          className='inline-flex items-center justify-center rounded-full bg-[#111827] px-6 py-3 font-semibold text-white transition hover:bg-[#1f2937]'
          onClick={() => reset()}
          type='button'
        >
          Try again
        </button>
      </div>
    </div>
  )
}

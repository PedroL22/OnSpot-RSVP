import Link from 'next/link'

export default function PublicEventNotFound() {
  return (
    <main className='min-h-screen bg-[#f6efe5] px-6 py-10 text-[#111827] sm:px-8 lg:px-10'>
      <div className='mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center'>
        <div className='w-full rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]'>
          <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>Event not found</p>

          <h1 className='mt-4 font-bold text-4xl tracking-[-0.04em]'>This RSVP page is no longer available.</h1>

          <p className='mt-4 text-slate-600 leading-7'>
            The link may be incorrect, or the organizer may have removed the event.
          </p>

          <Link
            className='mt-8 inline-flex items-center justify-center rounded-full bg-[#111827] px-6 py-3 font-semibold text-white transition hover:bg-[#1f2937]'
            href='/'
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  )
}

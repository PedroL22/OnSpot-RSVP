import Link from 'next/link'

import { CreateEventForm } from '~/components/events/create-event-form'

export default function CreateEventPage() {
  return (
    <section className='grid gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
      <div className='rounded-[2rem] bg-[#111827] p-8 text-white shadow-[0_24px_80px_rgba(17,24,39,0.24)]'>
        <div className='flex h-full flex-col justify-between gap-10'>
          <div className='space-y-4'>
            <p className='text-[#fbbf24] text-sm uppercase tracking-[0.28em]'>Create event</p>

            <h1 className='font-black text-4xl tracking-[-0.04em] sm:text-5xl'>
              Open the RSVP page with the smallest useful setup.
            </h1>

            <p className='max-w-xl text-slate-300 leading-7'>
              Create the event once, share the public link immediately, and let the dashboard handle confirmations,
              waitlists, and check-in.
            </p>
          </div>

          <div className='space-y-4 rounded-[1.5rem] border border-white/10 bg-white/6 p-5'>
            <p className='font-semibold text-lg'>What happens next</p>

            <ul className='flex list-disc flex-col gap-2 pl-5 text-slate-300'>
              <li>The public RSVP page is created automatically.</li>
              <li>Capacity limits are enforced on the server.</li>
              <li>Waitlisted guests can be promoted manually from the event detail page.</li>
            </ul>

            <Link className='inline-flex text-[#fbbf24] underline underline-offset-4' href='/dashboard'>
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className='rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10'>
        <div className='mb-8 space-y-3'>
          <p className='text-[#b45309] text-sm uppercase tracking-[0.28em]'>Event details</p>

          <h2 className='font-bold text-3xl tracking-[-0.03em]'>Set the basics and let the share page do the rest.</h2>

          <p className='text-slate-600 leading-7'>
            Capacity is optional. Leave it blank if you want an unlimited guest list.
          </p>
        </div>

        <CreateEventForm />
      </div>
    </section>
  )
}

import Link from 'next/link'

import { CreateEventForm } from '~/components/events/create-event-form'

export default function CreateEventPage() {
  return (
    <div className='space-y-6'>
      {/* Back navigation */}
      <Link
        className='group inline-flex items-center gap-2 text-ink-subtle text-sm transition-colors hover:text-ink'
        href='/dashboard'
      >
        <span className='transition-transform group-hover:-translate-x-1'>&larr;</span>
        Back to dashboard
      </Link>

      <section className='grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]'>
        {/* Left - Info panel */}
        <div className='relative overflow-hidden rounded-2xl bg-ink p-8 lg:p-10'>
          {/* Decorative elements */}
          <div className='diagonal-lines absolute inset-0 opacity-20' />
          <div className='absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-bl from-vermillion/20 to-transparent blur-3xl' />

          <div className='relative space-y-8'>
            <div className='space-y-4'>
              <div className='inline-flex items-center gap-2'>
                <span className='h-1.5 w-1.5 rounded-full bg-vermillion' />
                <span className='text-label text-paper/50'>New Event</span>
              </div>

              <h1 className='text-display-lg text-paper'>
                Create your
                <br />
                <span className='italic'>event</span>
              </h1>

              <p className='text-paper/60 leading-relaxed'>
                Set up once, share immediately. The public RSVP page is generated automatically and capacity limits are
                enforced server-side.
              </p>
            </div>

            {/* What happens next */}
            <div className='space-y-4 rounded-xl border border-paper/10 bg-paper/5 p-6'>
              <p className='font-medium text-paper'>What happens next</p>

              <ul className='space-y-3 text-paper/60 text-sm'>
                <li className='flex gap-3'>
                  <span className='text-vermillion'>01</span>
                  <span>Public RSVP page is created automatically</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-vermillion'>02</span>
                  <span>Capacity limits enforced on the server</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-vermillion'>03</span>
                  <span>Waitlisted guests can be promoted manually</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className='card-elevated p-8 lg:p-10'>
          <div className='mb-8 space-y-3'>
            <p className='text-label text-vermillion'>Event details</p>

            <h2 className='text-display-md'>Set the basics</h2>

            <p className='text-ink-subtle leading-relaxed'>
              Fill in the event details below. Capacity is optional &mdash; leave it blank for unlimited attendance.
            </p>
          </div>

          <CreateEventForm />
        </div>
      </section>
    </div>
  )
}

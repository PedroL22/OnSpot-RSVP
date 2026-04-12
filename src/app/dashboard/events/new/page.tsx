import Link from 'next/link'

import { CreateEventForm } from '~/components/events/create-event-form'

export default function CreateEventPage() {
  return (
    <div className='space-y-6'>

      {/* Back nav */}
      <Link
        className='group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-smoke-muted transition-colors hover:text-acid'
        href='/dashboard'
      >
        <span className='transition-transform group-hover:-translate-x-0.5'>←</span>
        Back to dashboard
      </Link>

      <section className='grid items-start gap-6 lg:grid-cols-[340px_1fr]'>

        {/* Left — Info panel */}
        <div className='relative overflow-hidden rounded border border-border bg-void-raised'>
          {/* Acid strip */}
          <div className='h-0.5 w-full bg-acid' />
          {/* Dot pattern */}
          <div className='dot-pattern absolute inset-0 opacity-60' />

          <div className='relative p-8'>
            <div className='space-y-8'>
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='h-1.5 w-1.5 rounded-full bg-acid' />
                  <span className='text-label' style={{ color: 'rgba(201,255,0,0.6)' }}>New Event</span>
                </div>

                <h1 className='text-display-lg leading-none'>
                  Create your
                  <br />
                  <span className='text-acid'>event</span>
                </h1>

                <p className='text-smoke-muted text-sm leading-relaxed'>
                  Set up once, share immediately. The public RSVP page is generated automatically and capacity limits are
                  enforced server-side.
                </p>
              </div>

              {/* What happens next */}
              <div className='space-y-4 rounded border border-border bg-void-surface p-5'>
                <p className='font-mono text-[11px] uppercase tracking-wider text-smoke-muted'>What happens next</p>

                <ul className='space-y-3'>
                  {[
                    'Public RSVP page is created automatically',
                    'Capacity limits enforced server-side',
                    'Waitlisted guests can be promoted manually',
                  ].map((item, i) => (
                    <li className='flex items-start gap-3' key={item}>
                      <span className='font-mono text-[10px] text-acid mt-0.5 shrink-0'>0{i + 1}</span>
                      <span className='text-smoke-muted text-sm'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className='card-elevated overflow-hidden'>
          <div className='h-0.5 w-full bg-acid' />
          <div className='p-8'>
            <div className='mb-8 space-y-3'>
              <p className='text-label text-acid' style={{ color: 'var(--color-acid)', opacity: 0.8 }}>Event details</p>
              <h2 className='text-display-md leading-none'>Set the basics</h2>
              <p className='text-smoke-muted text-sm leading-relaxed'>
                Fill in the event details. Capacity is optional — leave it blank for unlimited attendance.
              </p>
            </div>

            <CreateEventForm />
          </div>
        </div>
      </section>
    </div>
  )
}

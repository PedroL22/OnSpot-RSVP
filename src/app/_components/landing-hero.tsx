import type { ReactNode } from 'react'

import { DisplayTitle } from '~/components/layout/display-title'

import { FeatureList } from './feature-list'

type LandingHeroProps = {
  aside: ReactNode
}

const features = [
  {
    description: 'Share a single link and see responses arrive instantly.',
    id: 'public-rsvp',
    title: 'Public RSVP pages',
  },
  {
    description: 'Capacity overflow goes straight to waitlist and stays easy to manage.',
    id: 'waitlist',
    title: 'Waitlist automation',
  },
  {
    description: 'Run day-of check-in from a clean guest list without extra tooling.',
    id: 'check-in',
    title: 'Day-of check-in',
  },
]

export const LandingHero = ({ aside }: LandingHeroProps) => {
  return (
    <div className='mt-16 grid items-start gap-10 lg:mt-20 lg:grid-cols-[1fr_420px] lg:gap-16'>
      <section className='animate-[fade-up_0.5s_var(--ease-out-expo)_both] space-y-12'>
        <div>
          <DisplayTitle size='xl'>
            The sharpest
            <br />
            <span className='text-primary'>RSVP</span> system
            <br />
            you&apos;ll deploy.
          </DisplayTitle>
          <p className='mt-6 max-w-lg text-[1.0625rem] text-muted-foreground leading-relaxed'>
            One link. Instant RSVPs. Real-time check-in. Waitlist automation that doesn&apos;t need a tutorial.
          </p>
        </div>

        <FeatureList features={features} />

        <div className='flex flex-wrap items-center gap-2'>
          <span className='font-mono text-[10px] text-dim-foreground uppercase tracking-[0.18em]'>Built with</span>
          {['Next.js 15', 'React 19', 'Prisma', 'Better Auth'].map((tech) => (
            <span
              className='rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]'
              key={tech}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <div className='animation-delay-200 animate-[fade-up_0.5s_var(--ease-out-expo)_both]'>{aside}</div>
    </div>
  )
}

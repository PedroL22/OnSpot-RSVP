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
    <div className='mt-14 grid items-start gap-10 lg:mt-18 lg:grid-cols-[1fr_420px]'>
      <section className='animate-[fade-up_0.5s_var(--ease-out-expo)_both] space-y-10'>
        <div className=''>
          <DisplayTitle size='xl'>
            The sharpest
            <br />
            <span className='text-primary'>RSVP system</span>
            <br />
            you&apos;ll deploy.
          </DisplayTitle>
          <p className='mt-5 max-w-md text-[1.0625rem] text-muted-foreground leading-relaxed'>
            One link. Instant RSVPs. Real-time check-in. Waitlist automation that doesn&apos;t need a tutorial.
          </p>
        </div>

        <FeatureList features={features} />
      </section>

      <div className='animation-delay-200 animate-[fade-up_0.5s_var(--ease-out-expo)_both]'>{aside}</div>
    </div>
  )
}

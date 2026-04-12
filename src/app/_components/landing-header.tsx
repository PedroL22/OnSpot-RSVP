import type { ReactNode } from 'react'

import { BrandMark } from '~/components/brand/brand-mark'

type LandingHeaderProps = {
  actions: ReactNode
}

export const LandingHeader = ({ actions }: LandingHeaderProps) => {
  return (
    <header className='flex animate-[fade-in_0.4s_ease_both] items-center justify-between gap-4'>
      <BrandMark />
      {actions}
    </header>
  )
}

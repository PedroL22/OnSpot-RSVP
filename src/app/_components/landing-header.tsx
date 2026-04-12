import type { ReactNode } from 'react'

import { BrandMark } from '~/components/brand/brand-mark'
import { ThemeToggle } from '~/components/theme-toggle'

type LandingHeaderProps = {
  actions: ReactNode
}

export const LandingHeader = ({ actions }: LandingHeaderProps) => {
  return (
    <header className='flex animate-[fade-in_0.4s_ease_both] items-center justify-between gap-4'>
      <BrandMark />
      <div className='flex items-center gap-3'>
        <ThemeToggle />
        {actions}
      </div>
    </header>
  )
}

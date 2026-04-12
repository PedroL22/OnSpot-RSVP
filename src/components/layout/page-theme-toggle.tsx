import { ThemeToggle } from '~/components/theme-toggle'

import { cn } from '~/lib/utils'

type PageThemeToggleProps = {
  className?: string
}

export const PageThemeToggle = ({ className }: PageThemeToggleProps) => {
  return (
    <div className={cn('fixed top-6 right-6 z-50', className)}>
      <div className='rounded-full border border-border bg-card/85 p-1 shadow-(--shadow-md) backdrop-blur-sm'>
        <ThemeToggle />
      </div>
    </div>
  )
}

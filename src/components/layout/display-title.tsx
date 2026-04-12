import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

type DisplayTitleProps = {
  children: ReactNode
  className?: string
  size?: 'lg' | 'xl' | 'md'
}

const sizeClassName: Record<NonNullable<DisplayTitleProps['size']>, string> = {
  lg: 'text-[clamp(2.5rem,6vw,4.5rem)]',
  md: 'text-[clamp(2rem,4vw,3rem)]',
  xl: 'text-[clamp(3.5rem,10vw,7rem)]',
}

export const DisplayTitle = ({ children, className, size = 'lg' }: DisplayTitleProps) => {
  return (
    <h1
      className={cn(
        'font-display text-foreground uppercase leading-[0.9] tracking-[0.02em]',
        sizeClassName[size],
        className
      )}
    >
      {children}
    </h1>
  )
}

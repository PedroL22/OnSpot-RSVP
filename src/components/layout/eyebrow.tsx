import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

type EyebrowProps = {
  children: ReactNode
  className?: string
  dotClassName?: string
  withDot?: boolean
}

export const Eyebrow = ({ children, className, dotClassName, withDot = false }: EyebrowProps) => {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {withDot ? <span className={cn('size-1.5 rounded-full bg-primary', dotClassName)} /> : null}
      <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>{children}</span>
    </div>
  )
}

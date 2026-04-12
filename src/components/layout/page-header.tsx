import type { ReactNode } from 'react'

import { DisplayTitle } from './display-title'
import { Eyebrow } from './eyebrow'

import { cn } from '~/lib/utils'

type PageHeaderProps = {
  action?: ReactNode
  className?: string
  description?: ReactNode
  eyebrow?: ReactNode
  title: ReactNode
}

export const PageHeader = ({ action, className, description, eyebrow, title }: PageHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 border-border border-b pb-6 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className='space-y-3'>
        {!!eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <DisplayTitle className='text-[clamp(2.3rem,5vw,4rem)]' size='lg'>
          {title}
        </DisplayTitle>

        {!!description && <p className='max-w-2xl text-muted-foreground text-sm leading-relaxed'>{description}</p>}
      </div>

      {!!action && <div className='shrink-0'>{action}</div>}
    </div>
  )
}

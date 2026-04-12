import type { ReactNode } from 'react'

import { WarningCircle } from '@phosphor-icons/react/dist/ssr'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'

import { Eyebrow } from '../layout/eyebrow'

type ErrorStateProps = {
  actions?: ReactNode
  className?: string
  description: ReactNode
  eyebrow?: ReactNode
  title: ReactNode
}

export const ErrorState = ({ actions, className, description, eyebrow, title }: ErrorStateProps) => {
  return (
    <Card className={cn('border border-border/80 bg-card py-8 shadow-[var(--shadow-md)]', className)}>
      <CardHeader className='items-center px-8 text-center'>
        <div className='flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive'>
          <WarningCircle className='size-8' weight='duotone' />
        </div>
        <div className='space-y-3'>
          <Eyebrow>{eyebrow ?? 'Something went wrong'}</Eyebrow>
          <CardTitle className='font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.92] tracking-[0.02em]'>
            {title}
          </CardTitle>
          <p className='max-w-lg text-muted-foreground text-sm leading-relaxed'>{description}</p>
        </div>
      </CardHeader>
      {actions ? <CardContent className='flex flex-col justify-center gap-3 sm:flex-row'>{actions}</CardContent> : null}
    </Card>
  )
}

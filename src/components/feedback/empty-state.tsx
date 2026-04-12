import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import { cn } from '~/lib/utils'

type EmptyStateProps = {
  action?: ReactNode
  className?: string
  description: ReactNode
  icon?: ReactNode
  title: ReactNode
}

export const EmptyState = ({ action, className, description, icon, title }: EmptyStateProps) => {
  return (
    <Card className={cn('border border-dashed bg-card/90 py-10 text-center shadow-none', className)}>
      <CardHeader className='items-center gap-4 px-6'>
        {!!icon && (
          <div className='flex size-14 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground'>
            {icon}
          </div>
        )}

        <div className='flex flex-col items-center space-y-2'>
          <CardTitle className='font-display text-3xl uppercase tracking-[0.04em]'>{title}</CardTitle>
          <p className='max-w-md text-muted-foreground text-sm leading-relaxed'>{description}</p>
        </div>
      </CardHeader>

      {!!action && <CardContent className='flex justify-center'>{action}</CardContent>}
    </Card>
  )
}

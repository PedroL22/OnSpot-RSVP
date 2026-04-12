import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

type MetricCardProps = {
  className?: string
  label: ReactNode
  tone?: 'default' | 'primary' | 'warning' | 'success'
  value: ReactNode
}

const toneClassName: Record<NonNullable<MetricCardProps['tone']>, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
}

export const MetricCard = ({ className, label, tone = 'default', value }: MetricCardProps) => {
  return (
    <div className={cn('rounded-2xl border border-border bg-muted/50 p-4', className)}>
      <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>{label}</p>
      <p className={cn('mt-3 font-mono text-4xl tabular-nums leading-none', toneClassName[tone])}>{value}</p>
    </div>
  )
}

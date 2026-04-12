import { cn } from '~/lib/utils'

type CapacityMeterProps = {
  className?: string
  label?: string
  summary?: string | null
  value: number | null
}

const toneClassName = (value: number) => {
  if (value >= 90) return 'bg-destructive'
  if (value >= 70) return 'bg-warning'
  return 'bg-primary'
}

export const CapacityMeter = ({ className, label = 'Capacity', summary, value }: CapacityMeterProps) => {
  if (value === null) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex items-center justify-between gap-3'>
        <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>{label}</span>
        <span className='font-mono text-[11px] text-muted-foreground'>{summary ?? `${value}% filled`}</span>
      </div>

      <div className='h-2 overflow-hidden rounded-full bg-muted'>
        <div
          className={cn('h-full rounded-full transition-all duration-500', toneClassName(value))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

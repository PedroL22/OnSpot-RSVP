import { cn } from '~/lib/utils'

type PatternBackgroundProps = {
  className?: string
  variant?: 'dots' | 'grid'
}

export const PatternBackground = ({ className, variant = 'dots' }: PatternBackgroundProps) => {
  return (
    <div
      aria-hidden='true'
      className={cn(
        'pointer-events-none fixed inset-0',
        variant === 'dots'
          ? 'bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-border)_75%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]'
          : 'bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-size-[40px_40px] opacity-40',
        className
      )}
    />
  )
}

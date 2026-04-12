import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'

type FeatureListProps = {
  features: Array<{
    description: string
    id: string
    title: string
  }>
}

export const FeatureList = ({ features }: FeatureListProps) => {
  return (
    <div className='overflow-hidden rounded-2xl border border-border bg-card/70'>
      {features.map((feature, index) => (
        <div
          className='group flex items-center gap-5 not-last:border-border not-last:border-b px-5 py-4 transition-colors hover:bg-muted/60'
          key={feature.id}
        >
          <span className='shrink-0 font-mono text-[11px] text-dim-foreground tabular-nums'>
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className='min-w-0'>
            <p className='font-medium text-foreground text-sm'>{feature.title}</p>
            <p className='mt-1 text-muted-foreground text-xs'>{feature.description}</p>
          </div>

          <ArrowRightIcon className='ml-auto size-3.5 translate-x-0 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100' />
        </div>
      ))}
    </div>
  )
}

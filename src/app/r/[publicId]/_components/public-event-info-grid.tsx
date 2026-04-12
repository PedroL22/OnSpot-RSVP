import { CapacityMeter } from '~/components/data/capacity-meter'

type PublicEventInfoGridProps = {
  availabilityLabel: string
  capacitySummary: string | null
  capacityValue: number | null
  location: string
  startsAtLabel: string
}

export const PublicEventInfoGrid = ({
  availabilityLabel,
  capacitySummary,
  capacityValue,
  location,
  startsAtLabel,
}: PublicEventInfoGridProps) => {
  return (
    <div className='space-y-8'>
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>When</p>
          <p className='font-mono text-foreground text-sm leading-snug'>{startsAtLabel}</p>
        </div>
        <div className='space-y-2'>
          <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>Where</p>
          <p className='font-mono text-foreground text-sm leading-snug'>{location}</p>
        </div>
        <div className='space-y-2'>
          <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>Availability</p>
          <p className='font-mono text-foreground text-sm leading-snug'>{availabilityLabel}</p>
        </div>
      </div>

      <CapacityMeter summary={capacitySummary} value={capacityValue} />
    </div>
  )
}

import { CapacityMeter } from '~/components/data/capacity-meter'
import { Card, CardContent } from '~/components/ui/card'

type EventMetaGridProps = {
  capacityLabel: string | null
  capacityValue: number | null
  location: string
  startsAtLabel: string
}

export const EventMetaGrid = ({ capacityLabel, capacityValue, location, startsAtLabel }: EventMetaGridProps) => {
  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      <Card className='bg-muted/50 py-0 shadow-none'>
        <CardContent className='space-y-2 p-4'>
          <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>When</p>
          <p className='font-mono text-foreground text-sm'>{startsAtLabel}</p>
        </CardContent>
      </Card>
      <Card className='bg-muted/50 py-0 shadow-none'>
        <CardContent className='space-y-2 p-4'>
          <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>Where</p>
          <p className='font-mono text-foreground text-sm'>{location}</p>
        </CardContent>
      </Card>
      {capacityLabel ? (
        <Card className='bg-muted/50 py-0 shadow-none'>
          <CardContent className='space-y-3 p-4'>
            <p className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]'>Capacity</p>
            <p className='font-mono text-foreground text-sm'>{capacityLabel}</p>
            <CapacityMeter summary={`${capacityValue ?? 0}% filled`} value={capacityValue} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

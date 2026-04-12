import { DisplayTitle } from '~/components/layout/display-title'
import { Eyebrow } from '~/components/layout/eyebrow'
import { Card, CardContent } from '~/components/ui/card'
import { PublicEventInfoGrid } from './public-event-info-grid'

type PublicEventHeroCardProps = {
  availabilityLabel: string
  capacitySummary: string | null
  capacityValue: number | null
  description: string
  location: string
  startsAtLabel: string
  title: string
}

export const PublicEventHeroCard = ({
  availabilityLabel,
  capacitySummary,
  capacityValue,
  description,
  location,
  startsAtLabel,
  title,
}: PublicEventHeroCardProps) => {
  return (
    <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-(--shadow-md)'>
      <div className='h-1 w-full bg-primary' />

      <CardContent className='space-y-8 p-8 pt-4 lg:p-10 lg:pt-5'>
        <div className='space-y-4'>
          <Eyebrow withDot>Event invitation</Eyebrow>

          <DisplayTitle className='max-w-3xl' size='lg'>
            {title}
          </DisplayTitle>

          <p className='max-w-2xl text-[1.0625rem] text-muted-foreground leading-relaxed'>{description}</p>
        </div>

        <div className='h-px bg-border' />

        <PublicEventInfoGrid
          availabilityLabel={availabilityLabel}
          capacitySummary={capacitySummary}
          capacityValue={capacityValue}
          location={location}
          startsAtLabel={startsAtLabel}
        />
      </CardContent>
    </Card>
  )
}

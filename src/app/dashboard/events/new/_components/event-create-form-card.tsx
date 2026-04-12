import { CreateEventForm } from '~/components/events/create-event-form'
import { Eyebrow } from '~/components/layout/eyebrow'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export const EventCreateFormCard = () => {
  return (
    <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-(--shadow-md)'>
      <div className='h-1 w-full bg-primary' />

      <CardHeader className='px-8 pt-8'>
        <Eyebrow>Event details</Eyebrow>

        <CardTitle className='font-display text-[2.4rem] uppercase tracking-[0.02em]'>Set the basics</CardTitle>

        <p className='text-muted-foreground text-sm leading-relaxed'>
          Fill in the event details. Capacity is optional, so leave it blank for unlimited attendance.
        </p>
      </CardHeader>

      <CardContent className='px-8 pb-8'>
        <CreateEventForm />
      </CardContent>
    </Card>
  )
}

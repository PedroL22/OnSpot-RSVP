import { EventCreateFormCard } from './_components/event-create-form-card'
import { EventCreateIntro } from './_components/event-create-intro'

export default function CreateEventPage() {
  return (
    <div className='grid items-start gap-6 lg:grid-cols-[340px_1fr]'>
      <EventCreateIntro />
      <EventCreateFormCard />
    </div>
  )
}

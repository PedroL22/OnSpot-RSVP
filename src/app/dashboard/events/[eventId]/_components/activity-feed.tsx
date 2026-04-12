import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

type ActivityFeedProps = {
  activities: Array<{
    actorType: 'GUEST' | 'ORGANIZER' | 'SYSTEM'
    actorUser: {
      name: string | null
    } | null
    createdAt: Date
    id: string
    message: string
  }>
  formatDate: (date: Date) => string
}

const getActorLabel = (activity: ActivityFeedProps['activities'][number]) => {
  if (activity.actorType === 'ORGANIZER') {
    return activity.actorUser?.name ? `Organizer: ${activity.actorUser.name}` : 'Organizer'
  }

  if (activity.actorType === 'GUEST') {
    return 'Guest'
  }

  return 'System'
}

export const ActivityFeed = ({ activities, formatDate }: ActivityFeedProps) => {
  return (
    <Card className='border-border/80 bg-card/95 py-0 shadow-[var(--shadow-sm)]'>
      <CardHeader className='border-border border-b px-6 py-4'>
        <CardTitle className='font-display text-3xl uppercase tracking-[0.03em]'>Activity log</CardTitle>
        <p className='font-mono text-[11px] text-muted-foreground'>Recent guest activity</p>
      </CardHeader>
      <CardContent className='px-0 py-0'>
        {activities.length === 0 ? (
          <div className='px-6 py-12 text-center font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]'>
            Activity will appear here as guests RSVP and get checked in.
          </div>
        ) : (
          <div className='divide-y divide-border'>
            {activities.map((activity) => (
              <div className='flex items-center justify-between gap-4 px-6 py-4' key={activity.id}>
                <div className='flex min-w-0 items-start gap-3'>
                  <span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60' />
                  <div className='min-w-0'>
                    <p className='truncate text-foreground text-sm'>{activity.message}</p>
                    <p className='mt-1 font-mono text-[10px] text-muted-foreground'>{getActorLabel(activity)}</p>
                  </div>
                </div>
                <p className='shrink-0 font-mono text-[11px] text-muted-foreground'>{formatDate(activity.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { Badge } from '~/components/ui/badge'

type StatusBadgeProps = {
  status: 'CONFIRMED' | 'WAITLISTED'
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge variant={status === 'CONFIRMED' ? 'secondary' : 'outline'}>
      {status === 'CONFIRMED' ? 'Confirmed' : 'Waitlisted'}
    </Badge>
  )
}

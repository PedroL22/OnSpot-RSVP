import { StatusBadge } from '~/components/data/status-badge'
import { CheckInButton } from '~/components/events/check-in-button'
import { PromoteWaitlistButton } from '~/components/events/promote-waitlist-button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

type GuestListTableProps = {
  eventId: string
  formatDate: (date: Date) => string
  guests: Array<{
    checkedInAt: Date | null
    createdAt: Date
    email: string
    id: string
    name: string
    status: 'CONFIRMED' | 'WAITLISTED'
  }>
}

export const GuestListTable = ({ eventId, formatDate, guests }: GuestListTableProps) => {
  return (
    <Card className='gap-0 border-border/80 bg-card/95 py-0 shadow-(--shadow-sm)'>
      <CardHeader className='border-border border-b px-6 py-4'>
        <CardTitle className='font-display text-3xl uppercase tracking-[0.03em]'>Guest list</CardTitle>

        <p className='font-mono text-[11px] text-muted-foreground'>
          {guests.length} {guests.length === 1 ? 'guest' : 'guests'} registered
        </p>
      </CardHeader>

      <CardContent className='px-0 py-0'>
        {guests.length === 0 ? (
          <div className='px-6 py-12 text-center font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]'>
            No guests have RSVP&apos;d yet.
          </div>
        ) : (
          <Table>
            <TableHeader className='bg-muted/50'>
              <TableRow>
                {['Guest', 'Status', "RSVP'd", 'Check-in', 'Action'].map((column) => (
                  <TableHead
                    className='px-5 py-3 font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]'
                    key={column}
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className='px-5 py-4'>
                    <p className='font-medium text-foreground text-sm'>{guest.name}</p>
                    <p className='mt-1 font-mono text-[11px] text-muted-foreground'>{guest.email}</p>
                  </TableCell>

                  <TableCell className='px-5 py-4'>
                    <StatusBadge status={guest.status} />
                  </TableCell>

                  <TableCell className='px-5 py-4 font-mono text-[11px] text-muted-foreground'>
                    {formatDate(guest.createdAt)}
                  </TableCell>

                  <TableCell className='px-5 py-4 font-mono text-[11px] text-muted-foreground'>
                    {guest.checkedInAt ? formatDate(guest.checkedInAt) : '—'}
                  </TableCell>

                  <TableCell className='px-5 py-4'>
                    {guest.status === 'CONFIRMED' ? (
                      <CheckInButton checkedIn={Boolean(guest.checkedInAt)} eventId={eventId} rsvpId={guest.id} />
                    ) : (
                      <PromoteWaitlistButton eventId={eventId} rsvpId={guest.id} status={guest.status} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

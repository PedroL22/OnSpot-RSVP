import { headers } from 'next/headers'

import { toSlug } from '~/lib/formatters'
import { auth } from '~/server/better-auth'
import { db } from '~/server/db'
import { tryCatch } from '~/utils/try-catch'

type ExportRouteProps = {
  params: Promise<{
    eventId: string
  }>
}

const escapeCsvCell = (value: string) => {
  const escaped = value.replaceAll('"', '""')

  return `"${escaped}"`
}

export async function GET(_request: Request, { params }: ExportRouteProps) {
  const [{ eventId }, session] = await Promise.all([params, auth.api.getSession({ headers: await headers() })])

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { data: event, error } = await tryCatch(
    db.event.findFirst({
      select: {
        rsvps: {
          orderBy: { createdAt: 'asc' },
          select: {
            checkedInAt: true,
            createdAt: true,
            email: true,
            name: true,
            status: true,
          },
        },
        title: true,
      },
      where: {
        id: eventId,
        organizerId: session.user.id,
      },
    })
  )

  if (error) {
    return new Response('Unable to export CSV', { status: 500 })
  }

  if (!event) {
    return new Response('Not found', { status: 404 })
  }

  const header = ['name', 'email', 'status', 'checked_in', 'checked_in_at', 'created_at']
  const rows = event.rsvps.map((rsvp) => [
    escapeCsvCell(rsvp.name),
    escapeCsvCell(rsvp.email),
    escapeCsvCell(rsvp.status),
    escapeCsvCell(rsvp.checkedInAt ? 'true' : 'false'),
    escapeCsvCell(rsvp.checkedInAt ? rsvp.checkedInAt.toISOString() : ''),
    escapeCsvCell(rsvp.createdAt.toISOString()),
  ])

  const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n')
  const filename = `${toSlug(event.title) || 'event'}-guests.csv`

  return new Response(csv, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'text/csv; charset=utf-8',
    },
    status: 200,
  })
}

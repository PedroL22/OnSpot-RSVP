import { beforeEach, describe, expect, it, vi } from 'vitest'

const headersMock = vi.fn(() => new Headers())
const getSessionMock = vi.fn()
const findFirstMock = vi.fn()

vi.mock('next/headers', () => ({
  headers: headersMock,
}))

vi.mock('~/server/better-auth', () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}))

vi.mock('~/server/db', () => ({
  db: {
    event: {
      findFirst: findFirstMock,
    },
  },
}))

describe('event export route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 for unauthenticated requests', async () => {
    getSessionMock.mockResolvedValue(null)

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/export'), {
      params: Promise.resolve({ eventId: 'event_123' }),
    })

    expect(response.status).toBe(401)
    expect(findFirstMock).not.toHaveBeenCalled()
  })

  it('returns 404 when the event does not exist', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    findFirstMock.mockResolvedValue(null)

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/export'), {
      params: Promise.resolve({ eventId: 'event_123' }),
    })

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not found')
  })

  it('returns 500 when the export query fails', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    findFirstMock.mockRejectedValue(new Error('db failed'))

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/export'), {
      params: Promise.resolve({ eventId: 'event_123' }),
    })

    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Unable to export CSV')
  })

  it('returns a CSV response with hardened headers and neutralized formula cells', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    findFirstMock.mockResolvedValue({
      rsvps: [
        {
          checkedInAt: new Date('2026-05-12T23:00:00.000Z'),
          createdAt: new Date('2026-05-10T20:00:00.000Z'),
          email: '+alex@onspot.app',
          name: '=SUM(A1:A2)',
          status: 'CONFIRMED',
        },
      ],
      title: 'Launch Party',
    })

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/export'), {
      params: Promise.resolve({ eventId: 'event_123' }),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('private, no-store, max-age=0')
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="launch-party-guests.csv"')
    expect(response.headers.get('Content-Type')).toBe('text/csv; charset=utf-8')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')

    const csv = await response.text()

    expect(csv).toContain('"\'=SUM(A1:A2)"')
    expect(csv).toContain('"\'+alex@onspot.app"')
  })
})

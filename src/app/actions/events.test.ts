import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSessionMock = vi.fn()
const createMock = vi.fn()
const revalidatePathMock = vi.fn()
const redirectMock = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`)
})

vi.mock('next/cache', () => ({
  revalidatePath: revalidatePathMock,
}))

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}))

vi.mock('~/server/better-auth/server', () => ({
  getSession: getSessionMock,
}))

vi.mock('~/server/db', () => ({
  db: {
    event: {
      create: createMock,
    },
  },
}))

vi.mock('~/server/observability/server-action', () => ({
  withServerAction:
    (_actionName: string, handler: (...args: unknown[]) => Promise<unknown>) =>
    (...args: unknown[]) =>
      handler(
        {
          observe: {
            setAttributes: vi.fn(),
          },
        },
        ...args
      ),
}))

describe('createEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an auth error when the user is not signed in', async () => {
    getSessionMock.mockResolvedValue(null)

    const { createEvent } = await import('./events')
    const result = await createEvent({ success: false }, new FormData())

    expect(result).toEqual({
      message: 'You must sign in to create an event.',
      success: false,
    })
    expect(createMock).not.toHaveBeenCalled()
  })

  it('returns validation errors for invalid input', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })

    const { createEvent } = await import('./events')
    const formData = new FormData()
    formData.set('title', '')
    formData.set('description', '')
    formData.set('startsAt', 'invalid')
    formData.set('startsAtOffsetMinutes', '180')
    formData.set('location', '')
    formData.set('capacity', '-1')

    const result = await createEvent({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.fieldErrors?.title).toContain('Title is required.')
    expect(createMock).not.toHaveBeenCalled()
  })

  it('creates an event, revalidates the dashboard, and redirects on success', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    createMock.mockResolvedValue({ id: 'event_123', publicId: 'ckpublicevent123' })

    const { createEvent } = await import('./events')
    const formData = new FormData()
    formData.set('title', 'Launch party')
    formData.set('description', 'A small launch gathering.')
    formData.set('startsAt', '2026-05-12T19:30')
    formData.set('startsAtOffsetMinutes', '180')
    formData.set('location', 'Fortaleza')
    formData.set('capacity', '40')

    await expect(createEvent({ success: false }, formData)).rejects.toThrow('REDIRECT:/dashboard/events/event_123')
    expect(createMock).toHaveBeenCalledWith({
      data: {
        capacity: 40,
        description: 'A small launch gathering.',
        location: 'Fortaleza',
        organizerId: 'user_123',
        startsAt: new Date('2026-05-12T22:30:00.000Z'),
        startsAtOffsetMinutes: 180,
        title: 'Launch party',
      },
    })
    expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard')
  })

  it('returns a failure state when the database write fails', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    createMock.mockRejectedValue(new Error('db failed'))

    const { createEvent } = await import('./events')
    const formData = new FormData()
    formData.set('title', 'Launch party')
    formData.set('description', 'A small launch gathering.')
    formData.set('startsAt', '2026-05-12T19:30')
    formData.set('startsAtOffsetMinutes', '180')
    formData.set('location', 'Fortaleza')

    const result = await createEvent({ success: false }, formData)

    expect(result).toEqual({
      message: 'Unable to create the event right now.',
      success: false,
    })
    expect(revalidatePathMock).not.toHaveBeenCalled()
  })
})

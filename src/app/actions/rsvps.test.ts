import { Prisma } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const validEventId = 'ck12345678901234567890123'
const validRsvpId = 'ck98765432109876543210987'
const validPublicId = 'ck11223344556677889900112'

const getSessionMock = vi.fn()
const transactionMock = vi.fn()
const revalidatePathMock = vi.fn()

vi.mock('next/cache', () => ({
  revalidatePath: revalidatePathMock,
}))

vi.mock('~/server/better-auth/server', () => ({
  getSession: getSessionMock,
}))

vi.mock('~/server/db', () => ({
  db: {
    $transaction: transactionMock,
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

describe('rsvp actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createPrismaError = (code: string) => {
    return new Prisma.PrismaClientKnownRequestError('conflict', {
      clientVersion: 'test',
      code,
    })
  }

  it('returns validation errors for invalid RSVP input', async () => {
    const { createRsvp } = await import('./rsvps')
    const formData = new FormData()
    formData.set('eventPublicId', 'invalid')
    formData.set('name', '')
    formData.set('email', 'invalid-email')

    const result = await createRsvp({ success: false }, formData)

    expect(result.success).toBe(false)
    expect(result.fieldErrors?.email).toContain('Enter a valid email address.')
    expect(transactionMock).not.toHaveBeenCalled()
  })

  it('returns a duplicate message when the guest already exists', async () => {
    transactionMock.mockResolvedValue({ kind: 'duplicate' })

    const { createRsvp } = await import('./rsvps')
    const formData = new FormData()
    formData.set('eventPublicId', validPublicId)
    formData.set('name', 'Alex Morgan')
    formData.set('email', 'alex@onspot.app')

    const result = await createRsvp({ success: false }, formData)

    expect(result).toEqual({
      message: "This email has already RSVP'd for this event.",
      success: false,
    })
  })

  it('returns a confirmed success state and revalidates the public and dashboard paths', async () => {
    transactionMock.mockResolvedValue({
      eventId: 'event_123',
      eventPublicId: validPublicId,
      kind: 'created',
      rsvpId: 'rsvp_123',
      status: 'CONFIRMED',
    })

    const { createRsvp } = await import('./rsvps')
    const formData = new FormData()
    formData.set('eventPublicId', validPublicId)
    formData.set('name', 'Alex Morgan')
    formData.set('email', 'alex@onspot.app')

    const result = await createRsvp({ success: false }, formData)

    expect(result).toEqual({
      message: "You're confirmed.",
      rsvpStatus: 'CONFIRMED',
      success: true,
    })
    expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard/events/event_123')
    expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard')
    expect(revalidatePathMock).toHaveBeenCalledWith(`/r/${validPublicId}`)
  })

  it('retries createRsvp after a transient serializable conflict and succeeds on a later attempt', async () => {
    transactionMock.mockRejectedValueOnce(createPrismaError('P2034')).mockResolvedValueOnce({
      eventId: 'event_123',
      eventPublicId: validPublicId,
      kind: 'created',
      rsvpId: 'rsvp_123',
      status: 'CONFIRMED',
    })

    const { createRsvp } = await import('./rsvps')
    const formData = new FormData()
    formData.set('eventPublicId', validPublicId)
    formData.set('name', 'Alex Morgan')
    formData.set('email', 'alex@onspot.app')

    const result = await createRsvp({ success: false }, formData)

    expect(result).toEqual({
      message: "You're confirmed.",
      rsvpStatus: 'CONFIRMED',
      success: true,
    })
    expect(transactionMock).toHaveBeenCalledTimes(2)
  })

  it('returns a busy message when createRsvp exhausts serializable retries', async () => {
    transactionMock.mockRejectedValue(createPrismaError('P2034'))

    const { createRsvp } = await import('./rsvps')
    const formData = new FormData()
    formData.set('eventPublicId', validPublicId)
    formData.set('name', 'Alex Morgan')
    formData.set('email', 'alex@onspot.app')

    const result = await createRsvp({ success: false }, formData)

    expect(result).toEqual({
      message: 'This event is busy right now. Please try again.',
      success: false,
    })
    expect(transactionMock).toHaveBeenCalledTimes(3)
  })

  it('rejects check-in when there is no organizer session', async () => {
    getSessionMock.mockResolvedValue(null)

    const { markRsvpCheckedIn } = await import('./rsvps')
    const result = await markRsvpCheckedIn('event_123', 'rsvp_123')

    expect(result).toEqual({
      message: 'You must sign in to check guests in.',
      success: false,
    })
    expect(transactionMock).not.toHaveBeenCalled()
  })

  it('returns a clear message when the RSVP cannot be found during check-in', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    transactionMock.mockResolvedValue({ kind: 'missing-rsvp' })

    const { markRsvpCheckedIn } = await import('./rsvps')
    const result = await markRsvpCheckedIn(validEventId, validRsvpId)

    expect(result).toEqual({
      message: 'That RSVP could not be found.',
      success: false,
    })
  })

  it('returns a clear message when a waitlisted guest is checked in', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    transactionMock.mockResolvedValue({ kind: 'waitlisted' })

    const { markRsvpCheckedIn } = await import('./rsvps')
    const result = await markRsvpCheckedIn(validEventId, validRsvpId)

    expect(result).toEqual({
      message: 'Waitlisted guests cannot be checked in.',
      success: false,
    })
  })

  it('checks an RSVP in successfully and revalidates dependent paths', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    transactionMock.mockResolvedValue({
      eventId: 'event_123',
      eventPublicId: validPublicId,
      kind: 'checked-in',
      rsvpId: 'rsvp_123',
    })

    const { markRsvpCheckedIn } = await import('./rsvps')
    const result = await markRsvpCheckedIn(validEventId, validRsvpId)

    expect(result).toEqual({
      message: 'Guest checked in.',
      success: true,
    })
    expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard')
    expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard/events/event_123')
    expect(revalidatePathMock).toHaveBeenCalledWith(`/r/${validPublicId}`)
  })

  it('promotes a waitlisted RSVP and revalidates dependent paths', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    transactionMock.mockResolvedValue({
      eventId: 'event_123',
      eventPublicId: validPublicId,
      kind: 'promoted',
      rsvpId: 'rsvp_123',
    })

    const { promoteWaitlistedRsvp } = await import('./rsvps')
    const result = await promoteWaitlistedRsvp(validEventId, validRsvpId)

    expect(result).toEqual({
      message: 'Guest moved from the waitlist.',
      success: true,
    })
    expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard')
    expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard/events/event_123')
    expect(revalidatePathMock).toHaveBeenCalledWith(`/r/${validPublicId}`)
  })

  it('retries waitlist promotion after a transient serializable conflict and succeeds on a later attempt', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    transactionMock.mockRejectedValueOnce(createPrismaError('P2034')).mockResolvedValueOnce({
      eventId: 'event_123',
      eventPublicId: validPublicId,
      kind: 'promoted',
      rsvpId: 'rsvp_123',
    })

    const { promoteWaitlistedRsvp } = await import('./rsvps')
    const result = await promoteWaitlistedRsvp(validEventId, validRsvpId)

    expect(result).toEqual({
      message: 'Guest moved from the waitlist.',
      success: true,
    })
    expect(transactionMock).toHaveBeenCalledTimes(2)
  })

  it('returns a capacity message when no confirmed spots are available during waitlist promotion', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    transactionMock.mockResolvedValue({ kind: 'full' })

    const { promoteWaitlistedRsvp } = await import('./rsvps')
    const result = await promoteWaitlistedRsvp(validEventId, validRsvpId)

    expect(result).toEqual({
      message: 'No confirmed spots are available right now.',
      success: false,
    })
  })

  it('returns a generic failure when waitlist promotion exhausts serializable retries', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    transactionMock.mockRejectedValue(createPrismaError('P2034'))

    const { promoteWaitlistedRsvp } = await import('./rsvps')
    const result = await promoteWaitlistedRsvp(validEventId, validRsvpId)

    expect(result).toEqual({
      message: 'Unable to promote that guest right now.',
      success: false,
    })
    expect(transactionMock).toHaveBeenCalledTimes(3)
  })
})

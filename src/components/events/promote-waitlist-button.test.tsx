// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { promoteWaitlistedRsvpMock } = vi.hoisted(() => ({
  promoteWaitlistedRsvpMock: vi.fn(),
}))

vi.mock('~/app/actions/rsvps', () => ({
  promoteWaitlistedRsvp: promoteWaitlistedRsvpMock,
}))

import { PromoteWaitlistButton } from './promote-waitlist-button'

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((nextResolve) => {
    resolve = nextResolve
  })

  return { promise, resolve }
}

describe('PromoteWaitlistButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows an optimistic promoted state immediately and disables the button while the action is pending', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred<{ message?: string; success: boolean }>()
    promoteWaitlistedRsvpMock.mockReturnValue(deferred.promise)

    render(<PromoteWaitlistButton eventId='event_123' rsvpId='rsvp_123' status='WAITLISTED' />)

    await user.click(screen.getByRole('button', { name: /^promote$/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /promoted/i })).toBeDisabled()
    })
    expect(promoteWaitlistedRsvpMock).toHaveBeenCalledWith('event_123', 'rsvp_123')

    deferred.resolve({ success: true })
    await deferred.promise
  })

  it('rolls back the optimistic state and shows an error message when the action fails', async () => {
    const user = userEvent.setup()
    promoteWaitlistedRsvpMock.mockResolvedValue({
      message: 'No confirmed spots are available right now.',
      success: false,
    })

    render(<PromoteWaitlistButton eventId='event_123' rsvpId='rsvp_123' status='WAITLISTED' />)

    await user.click(screen.getByRole('button', { name: /^promote$/i }))

    expect(await screen.findByText('No confirmed spots are available right now.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^promote$/i })).toBeEnabled()
  })
})

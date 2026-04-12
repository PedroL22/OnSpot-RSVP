// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { markRsvpCheckedInMock } = vi.hoisted(() => ({
  markRsvpCheckedInMock: vi.fn(),
}))

vi.mock('~/app/actions/rsvps', () => ({
  markRsvpCheckedIn: markRsvpCheckedInMock,
}))

import { CheckInButton } from './check-in-button'

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((nextResolve) => {
    resolve = nextResolve
  })

  return { promise, resolve }
}

describe('CheckInButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows an optimistic checked-in state immediately and disables the button while the action is pending', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred<{ message?: string; success: boolean }>()
    markRsvpCheckedInMock.mockReturnValue(deferred.promise)

    render(<CheckInButton checkedIn={false} eventId='event_123' rsvpId='rsvp_123' />)

    await user.click(screen.getByRole('button', { name: /^check in$/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /checked in/i })).toBeDisabled()
    })
    expect(markRsvpCheckedInMock).toHaveBeenCalledWith('event_123', 'rsvp_123')

    deferred.resolve({ success: true })
    await deferred.promise
  })

  it('rolls back the optimistic state and shows an error message when the action fails', async () => {
    const user = userEvent.setup()
    markRsvpCheckedInMock.mockResolvedValue({
      message: 'Waitlisted guests cannot be checked in.',
      success: false,
    })

    render(<CheckInButton checkedIn={false} eventId='event_123' rsvpId='rsvp_123' />)

    await user.click(screen.getByRole('button', { name: /^check in$/i }))

    expect(await screen.findByText('Waitlisted guests cannot be checked in.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^check in$/i })).toBeEnabled()
  })
})

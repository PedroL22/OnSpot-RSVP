// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createRsvpMock, formActionMock, useActionStateMock } = vi.hoisted(() => ({
  createRsvpMock: vi.fn(),
  formActionMock: vi.fn(),
  useActionStateMock: vi.fn(),
}))

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react')

  return {
    ...actual,
    useActionState: useActionStateMock,
  }
})

vi.mock('~/app/actions/rsvps', () => ({
  createRsvp: createRsvpMock,
}))

import { PublicRsvpForm } from './public-rsvp-form'

describe('PublicRsvpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useActionStateMock.mockReturnValue([{ success: false }, formActionMock])
  })

  it('renders server field errors and error messages from the action state', () => {
    useActionStateMock.mockReturnValue([
      {
        fieldErrors: {
          email: ['Enter a valid email address.'],
          name: ['Name is required.'],
        },
        message: 'Please fix the highlighted fields and try again.',
        success: false,
      },
      formActionMock,
    ])

    render(<PublicRsvpForm eventPublicId='event_public_123' submitLabel='Confirm attendance' />)

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Please fix the highlighted fields and try again.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders success messages and resets the form after a successful submission', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<PublicRsvpForm eventPublicId='event_public_123' submitLabel='Confirm attendance' />)

    await user.type(screen.getByLabelText('Name'), 'Alex Morgan')
    await user.type(screen.getByLabelText('Email'), 'alex@onspot.app')

    expect(screen.getByLabelText('Name')).toHaveValue('Alex Morgan')
    expect(screen.getByLabelText('Email')).toHaveValue('alex@onspot.app')

    useActionStateMock.mockReturnValue([
      {
        message: "You're confirmed.",
        success: true,
      },
      formActionMock,
    ])

    rerender(<PublicRsvpForm eventPublicId='event_public_123' submitLabel='Confirm attendance' />)

    expect(screen.getByText("You're confirmed.")).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('')
      expect(screen.getByLabelText('Email')).toHaveValue('')
    })
  })
})

// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createEventMock, formActionMock, useActionStateMock } = vi.hoisted(() => ({
  createEventMock: vi.fn(),
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

vi.mock('~/app/actions/events', () => ({
  createEvent: createEventMock,
}))

import { CreateEventForm } from './create-event-form'

describe('CreateEventForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useActionStateMock.mockReturnValue([{ success: false }, formActionMock])
  })

  it('updates the hidden offset field when the starts-at input changes', () => {
    render(<CreateEventForm />)

    const startsAtInput = screen.getByLabelText('Starts at')
    fireEvent.change(startsAtInput, {
      target: {
        value: '2026-04-12T19:30',
      },
    })

    const offsetInput = document.querySelector<HTMLInputElement>('input[name="startsAtOffsetMinutes"]')

    expect(offsetInput).not.toBeNull()
    expect(offsetInput?.value).toBe(new Date('2026-04-12T19:30').getTimezoneOffset().toString())
  })

  it('renders field-level validation messages from the action state', () => {
    useActionStateMock.mockReturnValue([
      {
        fieldErrors: {
          startsAtOffsetMinutes: ['Enter a valid time zone offset.'],
          title: ['Title is required.'],
        },
        message: 'Please fix the highlighted fields and try again.',
        success: false,
      },
      formActionMock,
    ])

    render(<CreateEventForm />)

    expect(screen.getByText('Title is required.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid time zone offset.')).toBeInTheDocument()
    expect(screen.getByText('Please fix the highlighted fields and try again.')).toBeInTheDocument()
    expect(screen.getByLabelText('Event title')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Starts at')).toHaveAttribute('aria-invalid', 'true')
  })
})

'use client'

import { useActionState, useEffect, useRef } from 'react'

import { FormSubmitButton } from '~/components/form-submit-button'

import { createRsvp, initialCreateRsvpState } from '~/app/actions/rsvps'
import { cn } from '~/lib/utils'

type PublicRsvpFormProps = {
  eventPublicId: string
  submitLabel: string
}

const getFieldError = (fieldErrors: Record<string, string[]> | undefined, field: string) => {
  return fieldErrors?.[field]?.[0]
}

export const PublicRsvpForm = ({ eventPublicId, submitLabel }: PublicRsvpFormProps) => {
  const [state, formAction] = useActionState(createRsvp, initialCreateRsvpState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  const nameError = getFieldError(state.fieldErrors, 'name')
  const emailError = getFieldError(state.fieldErrors, 'email')

  return (
    <div className='space-y-5'>
      <form action={formAction} className='space-y-4' ref={formRef}>
        <input name='eventPublicId' type='hidden' value={eventPublicId} />

        <div className='space-y-2'>
          <label className='text-label' htmlFor='public-name'>
            Name
          </label>
          <input
            aria-invalid={Boolean(nameError)}
            className={cn('input-editorial', nameError && 'border-vermillion/50 bg-vermillion/[0.02]')}
            id='public-name'
            name='name'
            placeholder='Alex Morgan'
            type='text'
          />
          {nameError ? <p className='text-sm text-vermillion'>{nameError}</p> : null}
        </div>

        <div className='space-y-2'>
          <label className='text-label' htmlFor='public-email'>
            Email
          </label>
          <input
            aria-invalid={Boolean(emailError)}
            className={cn('input-editorial', emailError && 'border-vermillion/50 bg-vermillion/[0.02]')}
            id='public-email'
            name='email'
            placeholder='alex@onspot.app'
            type='email'
          />
          {emailError ? <p className='text-sm text-vermillion'>{emailError}</p> : null}
        </div>

        <FormSubmitButton idleLabel={submitLabel} pendingLabel='Submitting...' />
      </form>

      {!!state.message && (
        <div
          className={cn(
            'rounded-lg border p-4 text-sm',
            state.success
              ? 'border-emerald/20 bg-emerald/5 text-emerald-dim'
              : 'border-vermillion/20 bg-vermillion/5 text-vermillion'
          )}
        >
          <p className='font-medium'>{state.message}</p>
        </div>
      )}
    </div>
  )
}

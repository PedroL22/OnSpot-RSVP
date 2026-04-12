'use client'

import { useActionState, useEffect, useRef } from 'react'

import { FormSubmitButton } from '~/components/form-submit-button'
import { FormField } from '~/components/forms/form-field'
import { FormMessage } from '~/components/forms/form-message'
import { Input } from '~/components/ui/input'

import { createRsvp } from '~/app/actions/rsvps'
import { initialCreateRsvpState } from '~/app/actions/types'

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

        <FormField error={nameError} htmlFor='public-name' label='Name'>
          <Input aria-invalid={Boolean(nameError)} id='public-name' name='name' placeholder='Alex Morgan' type='text' />
        </FormField>

        <FormField error={emailError} htmlFor='public-email' label='Email'>
          <Input
            aria-invalid={Boolean(emailError)}
            id='public-email'
            name='email'
            placeholder='alex@onspot.app'
            type='email'
          />
        </FormField>

        <FormSubmitButton idleLabel={submitLabel} pendingLabel='Submitting...' />
      </form>

      {!!state.message && <FormMessage tone={state.success ? 'success' : 'destructive'}>{state.message}</FormMessage>}
    </div>
  )
}

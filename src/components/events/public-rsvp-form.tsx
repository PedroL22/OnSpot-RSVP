'use client'

import { useActionState, useEffect, useRef } from 'react'

import { FormSubmitButton } from '~/components/form-submit-button'

import { createRsvp, initialCreateRsvpState } from '~/app/actions/rsvps'
import { cn } from '~/lib/utils'

type PublicRsvpFormProps = {
  eventPublicId: string
  submitLabel: string
}

const inputClassName =
  'min-h-12 w-full rounded-2xl border border-[#111827]/10 bg-[#faf7f2] px-4 text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#111827]/25 focus:bg-white'

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
    <div className='flex flex-col gap-5'>
      <form action={formAction} className='flex flex-col gap-4' ref={formRef}>
        <input name='eventPublicId' type='hidden' value={eventPublicId} />

        <div className='flex flex-col gap-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='public-name'>
            Name
          </label>

          <input
            aria-invalid={Boolean(nameError)}
            className={cn(inputClassName, nameError && 'border-red-300 bg-red-50')}
            id='public-name'
            name='name'
            placeholder='Alex Morgan'
            type='text'
          />
          {nameError ? <p className='text-red-600 text-sm'>{nameError}</p> : null}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='public-email'>
            Email
          </label>

          <input
            aria-invalid={Boolean(emailError)}
            className={cn(inputClassName, emailError && 'border-red-300 bg-red-50')}
            id='public-email'
            name='email'
            placeholder='alex@onspot.app'
            type='email'
          />
          {emailError ? <p className='text-red-600 text-sm'>{emailError}</p> : null}
        </div>

        <FormSubmitButton idleLabel={submitLabel} pendingLabel='Submitting RSVP...' />
      </form>

      {!!state.message && (
        <p
          className={cn(
            'rounded-2xl border px-4 py-3 text-sm',
            state.success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          )}
        >
          {state.message}
        </p>
      )}
    </div>
  )
}

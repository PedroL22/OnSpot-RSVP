'use client'

import { useActionState, useState } from 'react'

import { FormField } from '~/components/forms/form-field'
import { FormMessage } from '~/components/forms/form-message'
import { FormSection } from '~/components/forms/form-section'
import { FormSubmitButton } from '~/components/form-submit-button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

import { createEvent } from '~/app/actions/events'
import { initialActionState } from '~/app/actions/types'

const getFieldError = (fieldErrors: Record<string, string[]> | undefined, field: string) => {
  return fieldErrors?.[field]?.[0]
}

const getDateTimeOffsetMinutes = (value: string) => {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return parsedDate.getTimezoneOffset().toString()
}

export const CreateEventForm = () => {
  const [state, formAction] = useActionState(createEvent, initialActionState)
  const [startsAtOffsetMinutes, setStartsAtOffsetMinutes] = useState('')

  const titleError = getFieldError(state.fieldErrors, 'title')
  const descriptionError = getFieldError(state.fieldErrors, 'description')
  const startsAtError =
    getFieldError(state.fieldErrors, 'startsAt') ?? getFieldError(state.fieldErrors, 'startsAtOffsetMinutes')
  const locationError = getFieldError(state.fieldErrors, 'location')
  const capacityError = getFieldError(state.fieldErrors, 'capacity')

  return (
    <form action={formAction} className='space-y-6'>
      <input name='startsAtOffsetMinutes' type='hidden' value={startsAtOffsetMinutes} />

      <FormSection columns={2}>
        <FormField className='sm:col-span-2' error={titleError} htmlFor='title' label='Event title'>
          <Input aria-invalid={Boolean(titleError)} id='title' name='title' placeholder='Spring launch gathering' />
        </FormField>

        <FormField className='sm:col-span-2' error={descriptionError} htmlFor='description' label='Description'>
          <Textarea
            aria-invalid={Boolean(descriptionError)}
            className='min-h-32 resize-none'
            id='description'
            name='description'
            placeholder='What guests should know before they arrive.'
          />
        </FormField>

        <FormField error={startsAtError} htmlFor='startsAt' label='Starts at'>
          <Input
            aria-invalid={Boolean(startsAtError)}
            id='startsAt'
            name='startsAt'
            onChange={(event) => setStartsAtOffsetMinutes(getDateTimeOffsetMinutes(event.currentTarget.value))}
            type='datetime-local'
          />
        </FormField>

        <FormField error={capacityError} htmlFor='capacity' label='Capacity'>
          <Input
            aria-invalid={Boolean(capacityError)}
            id='capacity'
            name='capacity'
            placeholder='Leave blank for unlimited'
            type='number'
          />
        </FormField>

        <FormField className='sm:col-span-2' error={locationError} htmlFor='location' label='Location'>
          <Input
            aria-invalid={Boolean(locationError)}
            id='location'
            name='location'
            placeholder='Rua dos Mercadores, 88'
            type='text'
          />
        </FormField>
      </FormSection>

      {state.message && !state.success ? <FormMessage tone='destructive'>{state.message}</FormMessage> : null}

      <FormSubmitButton idleLabel='Create event' pendingLabel='Creating...' />
    </form>
  )
}

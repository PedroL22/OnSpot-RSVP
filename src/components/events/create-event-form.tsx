'use client'

import { useActionState, useState } from 'react'

import { FormSubmitButton } from '~/components/form-submit-button'

import { createEvent } from '~/app/actions/events'
import { initialActionState } from '~/app/actions/types'
import { cn } from '~/lib/utils'

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

      <div className='grid gap-5 sm:grid-cols-2'>
        <div className='space-y-2 sm:col-span-2'>
          <label className='text-label' htmlFor='title'>
            Event title
          </label>
          <input
            aria-invalid={Boolean(titleError)}
            className={cn('input-editorial', titleError && 'border-vermillion/50 bg-vermillion/[0.02]')}
            id='title'
            name='title'
            placeholder='Spring launch gathering'
            type='text'
          />
          {titleError ? <p className='text-sm text-vermillion'>{titleError}</p> : null}
        </div>

        <div className='space-y-2 sm:col-span-2'>
          <label className='text-label' htmlFor='description'>
            Description
          </label>
          <textarea
            aria-invalid={Boolean(descriptionError)}
            className={cn(
              'input-editorial min-h-32 resize-none py-3',
              descriptionError && 'border-vermillion/50 bg-vermillion/[0.02]'
            )}
            id='description'
            name='description'
            placeholder='What guests should know before they arrive.'
          />
          {descriptionError ? <p className='text-sm text-vermillion'>{descriptionError}</p> : null}
        </div>

        <div className='space-y-2'>
          <label className='text-label' htmlFor='startsAt'>
            Starts at
          </label>
          <input
            aria-invalid={Boolean(startsAtError)}
            className={cn('input-editorial', startsAtError && 'border-vermillion/50 bg-vermillion/[0.02]')}
            id='startsAt'
            name='startsAt'
            onChange={(event) => setStartsAtOffsetMinutes(getDateTimeOffsetMinutes(event.currentTarget.value))}
            type='datetime-local'
          />
          {startsAtError ? <p className='text-sm text-vermillion'>{startsAtError}</p> : null}
        </div>

        <div className='space-y-2'>
          <label className='text-label' htmlFor='capacity'>
            Capacity
          </label>
          <input
            aria-invalid={Boolean(capacityError)}
            className={cn('input-editorial', capacityError && 'border-vermillion/50 bg-vermillion/[0.02]')}
            id='capacity'
            name='capacity'
            placeholder='Leave blank for unlimited'
            type='number'
          />
          {capacityError ? <p className='text-sm text-vermillion'>{capacityError}</p> : null}
        </div>

        <div className='space-y-2 sm:col-span-2'>
          <label className='text-label' htmlFor='location'>
            Location
          </label>
          <input
            aria-invalid={Boolean(locationError)}
            className={cn('input-editorial', locationError && 'border-vermillion/50 bg-vermillion/[0.02]')}
            id='location'
            name='location'
            placeholder='Rua dos Mercadores, 88'
            type='text'
          />
          {locationError ? <p className='text-sm text-vermillion'>{locationError}</p> : null}
        </div>
      </div>

      {state.message && !state.success ? (
        <div className='rounded-lg border border-vermillion/20 bg-vermillion/5 p-4'>
          <p className='text-sm text-vermillion'>{state.message}</p>
        </div>
      ) : null}

      <FormSubmitButton idleLabel='Create event' pendingLabel='Creating...' />
    </form>
  )
}

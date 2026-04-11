'use client'

import { useActionState, useState } from 'react'

import { FormSubmitButton } from '~/components/form-submit-button'

import { createEvent } from '~/app/actions/events'
import { initialActionState } from '~/app/actions/types'
import { cn } from '~/lib/utils'

const inputClassName =
  'min-h-12 w-full rounded-2xl border border-[#111827]/10 bg-[#faf7f2] px-4 text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#111827]/25 focus:bg-white'

const textareaClassName = `${inputClassName} min-h-36 py-3`

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
    <form action={formAction} className='flex flex-col gap-5'>
      <input name='startsAtOffsetMinutes' type='hidden' value={startsAtOffsetMinutes} />

      <div className='grid gap-5 sm:grid-cols-2'>
        <div className='flex flex-col gap-2 sm:col-span-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='title'>
            Title
          </label>

          <input
            aria-invalid={Boolean(titleError)}
            className={cn(inputClassName, titleError && 'border-red-300 bg-red-50')}
            id='title'
            name='title'
            placeholder='Spring launch gathering'
            type='text'
          />
          {titleError ? <p className='text-red-600 text-sm'>{titleError}</p> : null}
        </div>

        <div className='flex flex-col gap-2 sm:col-span-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='description'>
            Description
          </label>

          <textarea
            aria-invalid={Boolean(descriptionError)}
            className={cn(textareaClassName, descriptionError && 'border-red-300 bg-red-50')}
            id='description'
            name='description'
            placeholder='What guests should know before they arrive.'
          />
          {descriptionError ? <p className='text-red-600 text-sm'>{descriptionError}</p> : null}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='startsAt'>
            Starts at
          </label>

          <input
            aria-invalid={Boolean(startsAtError)}
            className={cn(inputClassName, startsAtError && 'border-red-300 bg-red-50')}
            id='startsAt'
            name='startsAt'
            onChange={(event) => setStartsAtOffsetMinutes(getDateTimeOffsetMinutes(event.currentTarget.value))}
            type='datetime-local'
          />
          {startsAtError ? <p className='text-red-600 text-sm'>{startsAtError}</p> : null}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='capacity'>
            Capacity
          </label>

          <input
            aria-invalid={Boolean(capacityError)}
            className={cn(inputClassName, capacityError && 'border-red-300 bg-red-50')}
            id='capacity'
            name='capacity'
            placeholder='Leave blank for unlimited'
            type='number'
          />
          {capacityError ? <p className='text-red-600 text-sm'>{capacityError}</p> : null}
        </div>

        <div className='flex flex-col gap-2 sm:col-span-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='location'>
            Location
          </label>

          <input
            aria-invalid={Boolean(locationError)}
            className={cn(inputClassName, locationError && 'border-red-300 bg-red-50')}
            id='location'
            name='location'
            placeholder='Rua dos Mercadores, 88'
            type='text'
          />
          {locationError ? <p className='text-red-600 text-sm'>{locationError}</p> : null}
        </div>
      </div>

      {state.message && !state.success ? <p className='text-red-600 text-sm'>{state.message}</p> : null}

      <FormSubmitButton idleLabel='Create event' pendingLabel='Creating event...' />
    </form>
  )
}

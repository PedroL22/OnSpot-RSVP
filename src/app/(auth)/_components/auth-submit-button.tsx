'use client'

import { useFormStatus } from 'react-dom'

import { cn } from '~/lib/utils'

type AuthSubmitButtonProps = {
  className?: string
  idleLabel: string
  pendingLabel: string
}

export const AuthSubmitButton = ({ className, idleLabel, pendingLabel }: AuthSubmitButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <button
      className={cn('btn-primary w-full', pending && 'cursor-not-allowed opacity-70', className)}
      disabled={pending}
      type='submit'
    >
      {pending ? (
        <>
          <svg aria-hidden='true' className='h-4 w-4 animate-spin' fill='none' focusable='false' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path className='opacity-75' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' fill='currentColor' />
          </svg>
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </button>
  )
}

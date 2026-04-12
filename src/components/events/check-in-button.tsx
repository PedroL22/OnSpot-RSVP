'use client'

import { useOptimistic, useState, useTransition } from 'react'

import { markRsvpCheckedIn } from '~/app/actions/rsvps'
import { cn } from '~/lib/utils'

type CheckInButtonProps = {
  checkedIn: boolean
  eventId: string
  rsvpId: string
}

export const CheckInButton = ({ checkedIn, eventId, rsvpId }: CheckInButtonProps) => {
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [optimisticCheckedIn, setOptimisticCheckedIn] = useOptimistic(
    checkedIn,
    (_currentState, nextState: boolean) => nextState
  )

  const handleCheckIn = () => {
    startTransition(async () => {
      setMessage(null)
      setOptimisticCheckedIn(true)

      const result = await markRsvpCheckedIn(eventId, rsvpId)

      if (!result.success) {
        setOptimisticCheckedIn(false)
        setMessage(result.message ?? 'Unable to check that guest in.')
      }
    })
  }

  return (
    <div className='flex flex-col gap-2'>
      <button
        className={cn(
          'inline-flex min-w-[7rem] items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-all duration-200',
          optimisticCheckedIn
            ? 'cursor-not-allowed bg-emerald/10 text-emerald-dim'
            : 'bg-ink text-paper hover:bg-ink-muted active:scale-[0.98]'
        )}
        disabled={optimisticCheckedIn || isPending}
        onClick={handleCheckIn}
        type='button'
      >
        {optimisticCheckedIn ? (
          <>
            <svg
              aria-hidden='true'
              className='h-4 w-4'
              fill='none'
              focusable='false'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M5 13l4 4L19 7' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
            </svg>
            Checked in
          </>
        ) : isPending ? (
          <>
            <svg aria-hidden='true' className='h-4 w-4 animate-spin' fill='none' focusable='false' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' fill='currentColor' />
            </svg>
            Checking in...
          </>
        ) : (
          'Check in'
        )}
      </button>

      {message ? <p className='max-w-[12rem] text-vermillion text-xs'>{message}</p> : null}
    </div>
  )
}

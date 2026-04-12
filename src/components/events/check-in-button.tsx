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
    <div className='flex flex-col gap-1.5'>
      <button
        className={cn(
          'inline-flex min-w-[7rem] items-center justify-center gap-1.5 rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-150',
          optimisticCheckedIn
            ? 'cursor-not-allowed border-success/30 bg-success/10 text-success'
            : 'border-border bg-void-surface text-smoke-muted hover:border-acid hover:text-acid active:scale-[0.98]'
        )}
        disabled={optimisticCheckedIn || isPending}
        onClick={handleCheckIn}
        type='button'
      >
        {optimisticCheckedIn ? (
          <>
            <svg aria-hidden='true' className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path d='M5 13l4 4L19 7' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} />
            </svg>
            Checked in
          </>
        ) : isPending ? (
          <>
            <svg aria-hidden='true' className='h-3 w-3 animate-spin' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' fill='currentColor' />
            </svg>
            Checking...
          </>
        ) : (
          'Check in'
        )}
      </button>

      {message ? (
        <p className='max-w-[10rem] font-mono text-[10px] text-danger'>{message}</p>
      ) : null}
    </div>
  )
}

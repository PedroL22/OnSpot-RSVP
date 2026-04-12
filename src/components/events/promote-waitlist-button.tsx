'use client'

import { useOptimistic, useState, useTransition } from 'react'

import { promoteWaitlistedRsvp } from '~/app/actions/rsvps'
import { cn } from '~/lib/utils'

type PromoteWaitlistButtonProps = {
  eventId: string
  rsvpId: string
  status: 'CONFIRMED' | 'WAITLISTED'
}

export const PromoteWaitlistButton = ({ eventId, rsvpId, status }: PromoteWaitlistButtonProps) => {
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    status,
    (_currentState, nextState: 'CONFIRMED' | 'WAITLISTED') => nextState
  )

  const handlePromote = () => {
    startTransition(async () => {
      setMessage(null)
      setOptimisticStatus('CONFIRMED')

      const result = await promoteWaitlistedRsvp(eventId, rsvpId)

      if (!result.success) {
        setOptimisticStatus('WAITLISTED')
        setMessage(result.message ?? 'Unable to promote that guest.')
      }
    })
  }

  return (
    <div className='flex flex-col gap-1.5'>
      <button
        className={cn(
          'inline-flex min-w-[7rem] items-center justify-center gap-1.5 rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-150',
          optimisticStatus === 'CONFIRMED'
            ? 'cursor-not-allowed border-success/30 bg-success/10 text-success'
            : 'border-warn/30 bg-warn/10 text-warn hover:bg-warn/20 active:scale-[0.98]'
        )}
        disabled={optimisticStatus === 'CONFIRMED' || isPending}
        onClick={handlePromote}
        type='button'
      >
        {optimisticStatus === 'CONFIRMED' ? (
          <>
            <svg aria-hidden='true' className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path d='M5 13l4 4L19 7' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} />
            </svg>
            Promoted
          </>
        ) : isPending ? (
          <>
            <svg aria-hidden='true' className='h-3 w-3 animate-spin' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' fill='currentColor' />
            </svg>
            Promoting...
          </>
        ) : (
          <>
            <svg aria-hidden='true' className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path d='M5 10l7-7m0 0l7 7m-7-7v18' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} />
            </svg>
            Promote
          </>
        )}
      </button>

      {message ? (
        <p className='max-w-[10rem] font-mono text-[10px] text-danger'>{message}</p>
      ) : null}
    </div>
  )
}

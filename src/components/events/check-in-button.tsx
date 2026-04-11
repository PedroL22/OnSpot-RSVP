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
          'inline-flex min-w-28 items-center justify-center rounded-full px-4 py-2 font-medium text-sm transition',
          optimisticCheckedIn
            ? 'cursor-not-allowed bg-emerald-100 text-emerald-800'
            : 'bg-[#111827] text-white hover:bg-[#1f2937]'
        )}
        disabled={optimisticCheckedIn || isPending}
        onClick={handleCheckIn}
        type='button'
      >
        {optimisticCheckedIn ? 'Checked in' : isPending ? 'Checking in...' : 'Check in'}
      </button>

      {message ? <p className='max-w-48 text-red-600 text-xs'>{message}</p> : null}
    </div>
  )
}

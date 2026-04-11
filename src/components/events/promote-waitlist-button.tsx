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
    <div className='flex flex-col gap-2'>
      <button
        className={cn(
          'inline-flex min-w-28 items-center justify-center rounded-full px-4 py-2 font-medium text-sm transition',
          optimisticStatus === 'CONFIRMED'
            ? 'cursor-not-allowed bg-sky-100 text-sky-800'
            : 'bg-[#f59e0b] text-[#111827] hover:bg-[#fbbf24]'
        )}
        disabled={optimisticStatus === 'CONFIRMED' || isPending}
        onClick={handlePromote}
        type='button'
      >
        {optimisticStatus === 'CONFIRMED' ? 'Promoted' : isPending ? 'Promoting...' : 'Promote'}
      </button>

      {message ? <p className='max-w-48 text-red-600 text-xs'>{message}</p> : null}
    </div>
  )
}

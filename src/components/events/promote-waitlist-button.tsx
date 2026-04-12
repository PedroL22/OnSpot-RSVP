'use client'

import { ArrowUp, Check, CircleNotch } from '@phosphor-icons/react/dist/ssr'
import { useOptimistic, useState, useTransition } from 'react'

import { FormMessage } from '~/components/forms/form-message'
import { Button } from '~/components/ui/button'

import { promoteWaitlistedRsvp } from '~/app/actions/rsvps'

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
    <div className='flex min-w-[9rem] flex-col gap-2'>
      <Button
        className='justify-center text-[0.7rem] uppercase tracking-[0.16em]'
        disabled={optimisticStatus === 'CONFIRMED' || isPending}
        onClick={handlePromote}
        type='button'
        variant={optimisticStatus === 'CONFIRMED' ? 'secondary' : 'outline'}
      >
        {optimisticStatus === 'CONFIRMED' ? (
          <>
            <Check data-icon='inline-start' weight='bold' />
            Promoted
          </>
        ) : isPending ? (
          <>
            <CircleNotch className='animate-spin' data-icon='inline-start' />
            Promoting...
          </>
        ) : (
          <>
            <ArrowUp data-icon='inline-start' />
            Promote
          </>
        )}
      </Button>

      {message ? <FormMessage tone='destructive'>{message}</FormMessage> : null}
    </div>
  )
}

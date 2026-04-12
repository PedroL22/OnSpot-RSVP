'use client'

import { useOptimistic, useState, useTransition } from 'react'

import { CheckIcon, CircleNotchIcon } from '@phosphor-icons/react/dist/ssr'
import { FormMessage } from '~/components/forms/form-message'
import { Button } from '~/components/ui/button'

import { markRsvpCheckedIn } from '~/app/actions/rsvps'

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
    <div className='flex min-w-36 flex-col gap-2'>
      <Button
        className='justify-center text-[0.7rem] uppercase tracking-[0.16em]'
        disabled={optimisticCheckedIn || isPending}
        onClick={handleCheckIn}
        type='button'
        variant={optimisticCheckedIn ? 'secondary' : 'outline'}
      >
        {optimisticCheckedIn ? (
          <>
            <CheckIcon data-icon='inline-start' weight='bold' />
            Checked in
          </>
        ) : isPending ? (
          <>
            <CircleNotchIcon className='animate-spin' data-icon='inline-start' />
            Checking...
          </>
        ) : (
          'Check in'
        )}
      </Button>

      {!!message && <FormMessage tone='destructive'>{message}</FormMessage>}
    </div>
  )
}

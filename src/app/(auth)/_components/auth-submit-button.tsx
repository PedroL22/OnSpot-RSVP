'use client'

import { useFormStatus } from 'react-dom'

import { CircleNotchIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '~/components/ui/button'

import { cn } from '~/lib/utils'

type AuthSubmitButtonProps = {
  className?: string
  idleLabel: string
  pendingLabel: string
}

export const AuthSubmitButton = ({ className, idleLabel, pendingLabel }: AuthSubmitButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <Button
      className={cn('h-10 w-full gap-2 text-[0.8rem] uppercase tracking-[0.16em]', className)}
      disabled={pending}
      type='submit'
    >
      {pending ? (
        <>
          <CircleNotchIcon className='animate-spin' data-icon='inline-start' />
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </Button>
  )
}

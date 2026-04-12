'use client'

import { CircleNotch } from '@phosphor-icons/react/dist/ssr'
import { useFormStatus } from 'react-dom'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type FormSubmitButtonProps = {
  className?: string
  idleLabel: string
  pendingLabel: string
  variant?: 'default' | 'outline'
}

export const FormSubmitButton = ({
  className,
  idleLabel,
  pendingLabel,
  variant = 'default',
}: FormSubmitButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <Button
      className={cn('h-10 w-full gap-2 text-[0.8rem] uppercase tracking-[0.16em]', className)}
      disabled={pending}
      type='submit'
      variant={variant}
    >
      {pending ? (
        <>
          <CircleNotch className='animate-spin' data-icon='inline-start' />
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </Button>
  )
}

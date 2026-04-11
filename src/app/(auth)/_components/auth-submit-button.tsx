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
      className={cn(
        'inline-flex w-full items-center justify-center rounded-full bg-[#111827] px-6 py-3 font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-70',
        className
      )}
      disabled={pending}
      type='submit'
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  )
}

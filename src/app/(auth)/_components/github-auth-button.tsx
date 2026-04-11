'use client'

import { useActionState } from 'react'

import { signInWithGitHub } from '../actions'
import { initialAuthActionState } from '../auth-schemas'
import { AuthSubmitButton } from './auth-submit-button'

type GitHubAuthButtonProps = {
  callbackURL: string
}

export const GitHubAuthButton = ({ callbackURL }: GitHubAuthButtonProps) => {
  const [state, formAction] = useActionState(signInWithGitHub, initialAuthActionState)

  return (
    <form action={formAction} className='flex flex-col gap-3'>
      <input name='callbackURL' type='hidden' value={callbackURL} />
      {state.error ? <p className='text-red-600 text-sm'>{state.error}</p> : null}
      <AuthSubmitButton
        className='border border-[#111827]/12 bg-[#faf7f2] text-[#111827] hover:bg-[#f3eadc]'
        idleLabel='Continue with GitHub'
        pendingLabel='Redirecting to GitHub...'
      />
    </form>
  )
}

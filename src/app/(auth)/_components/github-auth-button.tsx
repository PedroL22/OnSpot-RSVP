'use client'

import { GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { useActionState } from 'react'

import { FormMessage } from '~/components/forms/form-message'
import { Button } from '~/components/ui/button'

import { signInWithGitHub } from '../actions'
import { initialAuthActionState } from '../auth-schemas'

type GitHubAuthButtonProps = {
  callbackURL: string
}

export const GitHubAuthButton = ({ callbackURL }: GitHubAuthButtonProps) => {
  const [state, formAction, isPending] = useActionState(signInWithGitHub, initialAuthActionState)

  return (
    <form action={formAction} className='flex flex-col gap-3'>
      <input name='callbackURL' type='hidden' value={callbackURL} />
      {state.error ? <FormMessage tone='destructive'>{state.error}</FormMessage> : null}
      <Button
        className='h-10 w-full gap-3 text-[0.8rem] uppercase tracking-[0.16em]'
        disabled={isPending}
        type='submit'
        variant='outline'
      >
        <GithubLogo data-icon='inline-start' weight='fill' />
        {isPending ? 'Redirecting...' : 'Continue with GitHub'}
      </Button>
    </form>
  )
}

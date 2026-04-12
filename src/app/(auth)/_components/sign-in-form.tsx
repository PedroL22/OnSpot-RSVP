'use client'

import { useActionState } from 'react'

import { FormField } from '~/components/forms/form-field'
import { FormMessage } from '~/components/forms/form-message'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { AuthSubmitButton } from './auth-submit-button'
import { GitHubAuthButton } from './github-auth-button'

import { signInWithEmail } from '../actions'
import { initialAuthActionState } from '../auth-schemas'

type SignInFormProps = {
  callbackURL: string
  showGitHub: boolean
}

export const SignInForm = ({ callbackURL, showGitHub }: SignInFormProps) => {
  const [state, formAction] = useActionState(signInWithEmail, initialAuthActionState)

  return (
    <div className='space-y-4'>
      <form action={formAction} className='space-y-5'>
        <input name='callbackURL' type='hidden' value={callbackURL} />

        <FormField htmlFor='email' label='Email'>
          <Input autoComplete='email' id='email' name='email' placeholder='alex@onspot.app' type='email' />
        </FormField>

        <FormField htmlFor='password' label='Password'>
          <Input
            autoComplete='current-password'
            id='password'
            name='password'
            placeholder='At least 8 characters'
            type='password'
          />
        </FormField>

        {!!state.error && <FormMessage tone='destructive'>{state.error}</FormMessage>}

        <AuthSubmitButton idleLabel='Sign in' pendingLabel='Signing in...' />
      </form>

      {!!showGitHub && (
        <>
          <div className='flex items-center gap-4'>
            <Separator className='flex-1' />
            <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]'>or</span>
            <Separator className='flex-1' />
          </div>

          <GitHubAuthButton callbackURL={callbackURL} />
        </>
      )}
    </div>
  )
}

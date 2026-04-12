'use client'

import { useActionState } from 'react'

import { FormField } from '~/components/forms/form-field'
import { FormMessage } from '~/components/forms/form-message'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { AuthSubmitButton } from './auth-submit-button'
import { GitHubAuthButton } from './github-auth-button'

import { signUpWithEmail } from '../actions'
import { initialAuthActionState } from '../auth-schemas'

type SignUpFormProps = {
  callbackURL: string
  showGitHub: boolean
}

export const SignUpForm = ({ callbackURL, showGitHub }: SignUpFormProps) => {
  const [state, formAction] = useActionState(signUpWithEmail, initialAuthActionState)

  return (
    <div className='space-y-6'>
      <form action={formAction} className='space-y-5'>
        <input name='callbackURL' type='hidden' value={callbackURL} />

        <FormField htmlFor='name' label='Name'>
          <Input autoComplete='name' id='name' name='name' placeholder='Alex Morgan' type='text' />
        </FormField>

        <FormField htmlFor='email' label='Email'>
          <Input autoComplete='email' id='email' name='email' placeholder='alex@onspot.app' type='email' />
        </FormField>

        <FormField htmlFor='password' label='Password'>
          <Input
            autoComplete='new-password'
            id='password'
            name='password'
            placeholder='At least 8 characters'
            type='password'
          />
        </FormField>

        {state.error ? <FormMessage tone='destructive'>{state.error}</FormMessage> : null}

        <AuthSubmitButton idleLabel='Create account' pendingLabel='Creating account...' />
      </form>

      {showGitHub ? (
        <>
          <div className='flex items-center gap-4'>
            <Separator className='flex-1' />
            <span className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]'>or</span>
            <Separator className='flex-1' />
          </div>
          <GitHubAuthButton callbackURL={callbackURL} />
        </>
      ) : null}
    </div>
  )
}

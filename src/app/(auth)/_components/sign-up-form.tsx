'use client'

import { useActionState } from 'react'

import { signUpWithEmail } from '../actions'
import { initialAuthActionState } from '../auth-schemas'
import { AuthSubmitButton } from './auth-submit-button'
import { GitHubAuthButton } from './github-auth-button'

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

        <div className='space-y-2'>
          <label className='text-label' htmlFor='name'>
            Name
          </label>
          <input
            autoComplete='name'
            className='input-editorial'
            id='name'
            name='name'
            placeholder='Alex Morgan'
            type='text'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-label' htmlFor='email'>
            Email
          </label>
          <input
            autoComplete='email'
            className='input-editorial'
            id='email'
            name='email'
            placeholder='alex@onspot.app'
            type='email'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-label' htmlFor='password'>
            Password
          </label>
          <input
            autoComplete='new-password'
            className='input-editorial'
            id='password'
            name='password'
            placeholder='At least 8 characters'
            type='password'
          />
        </div>

        {state.error ? (
          <div className='rounded-lg border border-vermillion/20 bg-vermillion/5 p-3'>
            <p className='text-sm text-vermillion'>{state.error}</p>
          </div>
        ) : null}

        <AuthSubmitButton idleLabel='Create account' pendingLabel='Creating account...' />
      </form>

      {showGitHub ? (
        <>
          <div className='flex items-center gap-4'>
            <div className='h-px flex-1 bg-border' />
            <span className='text-ink-subtle text-xs uppercase tracking-wider'>or</span>
            <div className='h-px flex-1 bg-border' />
          </div>
          <GitHubAuthButton callbackURL={callbackURL} />
        </>
      ) : null}
    </div>
  )
}

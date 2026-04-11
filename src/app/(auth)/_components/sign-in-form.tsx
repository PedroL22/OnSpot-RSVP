'use client'

import { useActionState } from 'react'

import { signInWithEmail } from '../actions'
import { initialAuthActionState } from '../auth-schemas'
import { AuthSubmitButton } from './auth-submit-button'
import { GitHubAuthButton } from './github-auth-button'

type SignInFormProps = {
  callbackURL: string
  showGitHub: boolean
}

export const SignInForm = ({ callbackURL, showGitHub }: SignInFormProps) => {
  const [state, formAction] = useActionState(signInWithEmail, initialAuthActionState)

  return (
    <div className='flex flex-col gap-6'>
      <form action={formAction} className='flex flex-col gap-4'>
        <input name='callbackURL' type='hidden' value={callbackURL} />

        <div className='space-y-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='email'>
            Email
          </label>
          <input
            autoComplete='email'
            className='h-12 w-full rounded-2xl border border-[#111827]/10 bg-[#faf7f2] px-4 text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#111827]/25 focus:bg-white'
            id='email'
            name='email'
            placeholder='alex@onspot.app'
            type='email'
          />
        </div>

        <div className='space-y-2'>
          <label className='font-medium text-slate-700 text-sm' htmlFor='password'>
            Password
          </label>
          <input
            autoComplete='current-password'
            className='h-12 w-full rounded-2xl border border-[#111827]/10 bg-[#faf7f2] px-4 text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#111827]/25 focus:bg-white'
            id='password'
            name='password'
            placeholder='At least 8 characters'
            type='password'
          />
        </div>

        {state.error ? <p className='text-red-600 text-sm'>{state.error}</p> : null}

        <AuthSubmitButton idleLabel='Sign in' pendingLabel='Signing in...' />
      </form>

      {showGitHub ? (
        <>
          <div className='flex items-center gap-3 text-slate-400 text-sm'>
            <div className='h-px flex-1 bg-[#111827]/10' />
            <span>or</span>
            <div className='h-px flex-1 bg-[#111827]/10' />
          </div>
          <GitHubAuthButton callbackURL={callbackURL} />
        </>
      ) : null}
    </div>
  )
}

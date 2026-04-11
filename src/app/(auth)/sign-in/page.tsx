import { redirect } from 'next/navigation'

import { AuthShell } from '../_components/auth-shell'
import { SignInForm } from '../_components/sign-in-form'

import { isGitHubAuthEnabled } from '~/server/better-auth'
import { getSession } from '~/server/better-auth/server'

type SignInPageProps = {
  searchParams: Promise<{
    callbackURL?: string
  }>
}

const getCallbackURL = (callbackURL?: string) => {
  return callbackURL?.startsWith('/') ? callbackURL : '/dashboard'
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const [session, { callbackURL }] = await Promise.all([getSession(), searchParams])

  if (session?.user) {
    redirect('/')
  }

  const nextCallbackURL = getCallbackURL(callbackURL)

  return (
    <AuthShell
      alternateHref={`/sign-up?callbackURL=${encodeURIComponent(nextCallbackURL)}`}
      alternateLabel='Need a new account?'
      alternateText='Create one'
      description='Use email and password for the direct path, or unlock GitHub sign-in as soon as the OAuth keys are added.'
      title='Sign in and get back to the guest list.'
    >
      <SignInForm callbackURL={nextCallbackURL} showGitHub={isGitHubAuthEnabled} />
    </AuthShell>
  )
}

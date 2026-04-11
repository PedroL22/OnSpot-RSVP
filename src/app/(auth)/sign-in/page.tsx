import { redirect } from 'next/navigation'

import { AuthShell } from '../_components/auth-shell'
import { SignInForm } from '../_components/sign-in-form'

import { isGitHubAuthEnabled } from '~/server/better-auth'
import { getSession } from '~/server/better-auth/server'

export default async function SignInPage() {
  const session = await getSession()

  if (session?.user) {
    redirect('/')
  }

  return (
    <AuthShell
      alternateHref='/sign-up'
      alternateLabel='Need a new account?'
      alternateText='Create one'
      description='Use email and password for the direct path, or unlock GitHub sign-in as soon as the OAuth keys are added.'
      title='Sign in and get back to the guest list.'
    >
      <SignInForm callbackURL='/' showGitHub={isGitHubAuthEnabled} />
    </AuthShell>
  )
}

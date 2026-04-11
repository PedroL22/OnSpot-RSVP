import { redirect } from 'next/navigation'

import { AuthShell } from '../_components/auth-shell'
import { SignUpForm } from '../_components/sign-up-form'

import { isGitHubAuthEnabled } from '~/server/better-auth'
import { getSession } from '~/server/better-auth/server'

type SignUpPageProps = {
  searchParams: Promise<{
    callbackURL?: string
  }>
}

const getCallbackURL = (callbackURL?: string) => {
  return callbackURL?.startsWith('/') ? callbackURL : '/dashboard'
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const [session, { callbackURL }] = await Promise.all([getSession(), searchParams])

  if (session?.user) {
    redirect('/')
  }

  const nextCallbackURL = getCallbackURL(callbackURL)

  return (
    <AuthShell
      alternateHref={`/sign-in?callbackURL=${encodeURIComponent(nextCallbackURL)}`}
      alternateLabel='Already have an account?'
      alternateText='Sign in'
      description='Open registration stays simple: name, email, password, and you are inside. GitHub can join the flow the moment the keys are present.'
      title='Create your account before the doors open.'
    >
      <SignUpForm callbackURL={nextCallbackURL} showGitHub={isGitHubAuthEnabled} />
    </AuthShell>
  )
}

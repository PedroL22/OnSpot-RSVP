import { redirect } from 'next/navigation'

import { AuthShell } from '../_components/auth-shell'
import { SignUpForm } from '../_components/sign-up-form'

import { RoutePrefetch } from '~/components/navigation/route-prefetch'
import { isGitHubAuthEnabled } from '~/server/better-auth'
import { sanitizeCallbackURL } from '~/server/better-auth/callback-url'
import { getSession } from '~/server/better-auth/server'

type SignUpPageProps = {
  searchParams: Promise<{
    callbackURL?: string
  }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const [session, { callbackURL }] = await Promise.all([getSession(), searchParams])

  if (session?.user) {
    redirect('/')
  }

  const nextCallbackURL = sanitizeCallbackURL(callbackURL)

  return (
    <AuthShell
      alternateHref={`/sign-in?callbackURL=${encodeURIComponent(nextCallbackURL)}`}
      alternateLabel='Already have an account?'
      alternateText='Sign in'
      description='Open registration stays simple: name, email, password, and you are inside. GitHub can join the flow the moment the keys are present.'
      title='Create your account before the doors open.'
    >
      <RoutePrefetch hrefs={['/sign-in', nextCallbackURL]} />
      <SignUpForm callbackURL={nextCallbackURL} showGitHub={isGitHubAuthEnabled} />
    </AuthShell>
  )
}

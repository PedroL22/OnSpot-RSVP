import { redirect } from 'next/navigation'

import { AuthShell } from '../_components/auth-shell'
import { SignUpForm } from '../_components/sign-up-form'

import { isGitHubAuthEnabled } from '~/server/better-auth'
import { getSession } from '~/server/better-auth/server'

export default async function SignUpPage() {
  const session = await getSession()

  if (session?.user) {
    redirect('/')
  }

  return (
    <AuthShell
      alternateHref='/sign-in'
      alternateLabel='Already have an account?'
      alternateText='Sign in'
      description='Open registration stays simple: name, email, password, and you are inside. GitHub can join the flow the moment the keys are present.'
      title='Create your account before the doors open.'
    >
      <SignUpForm callbackURL='/' showGitHub={isGitHubAuthEnabled} />
    </AuthShell>
  )
}

'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { z } from 'zod'

import { auth, isGitHubAuthEnabled } from '~/server/better-auth'
import { getSession } from '~/server/better-auth/server'
import { withServerAction } from '~/server/observability/server-action'
import { tryCatch } from '~/utils/try-catch'

import {
  type AuthActionState,
  signInWithEmailSchema,
  signInWithGitHubSchema,
  signUpWithEmailSchema,
} from './auth-schemas'

const getValidationError = (error: z.ZodError) => {
  return error.issues[0]?.message ?? 'Invalid input.'
}

export const signInWithEmail = withServerAction(
  'auth_sign_in_with_email',
  async (context, _prevState: AuthActionState, formData: FormData): Promise<AuthActionState> => {
    const parsed = signInWithEmailSchema.safeParse({
      callbackURL: formData.get('callbackURL') ?? '/dashboard',
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!parsed.success) {
      return { success: false, error: getValidationError(parsed.error) }
    }

    context.observe.setAttributes({
      'auth.action': 'sign_in',
      'auth.provider': 'email',
      'auth.redirect_to': parsed.data.callbackURL,
    })

    const { error } = await tryCatch(
      auth.api.signInEmail({
        body: {
          callbackURL: parsed.data.callbackURL,
          email: parsed.data.email,
          password: parsed.data.password,
        },
      })
    )

    if (error) {
      return { success: false, error: 'Unable to sign in with that email and password.' }
    }

    context.observe.setAttributes({
      success: true,
    })

    redirect(parsed.data.callbackURL)
  }
)

export const signUpWithEmail = withServerAction(
  'auth_sign_up_with_email',
  async (context, _prevState: AuthActionState, formData: FormData): Promise<AuthActionState> => {
    const parsed = signUpWithEmailSchema.safeParse({
      callbackURL: formData.get('callbackURL') ?? '/dashboard',
      email: formData.get('email'),
      name: formData.get('name'),
      password: formData.get('password'),
    })

    if (!parsed.success) {
      return { success: false, error: getValidationError(parsed.error) }
    }

    context.observe.setAttributes({
      'auth.action': 'sign_up',
      'auth.provider': 'email',
      'auth.redirect_to': parsed.data.callbackURL,
    })

    const { error } = await tryCatch(
      auth.api.signUpEmail({
        body: {
          callbackURL: parsed.data.callbackURL,
          email: parsed.data.email,
          name: parsed.data.name,
          password: parsed.data.password,
        },
      })
    )

    if (error) {
      return { success: false, error: 'Unable to create your account right now.' }
    }

    context.observe.setAttributes({
      success: true,
    })

    redirect(parsed.data.callbackURL)
  }
)

export const signInWithGitHub = withServerAction(
  'auth_sign_in_with_github',
  async (context, _prevState: AuthActionState, formData: FormData): Promise<AuthActionState> => {
    if (!isGitHubAuthEnabled) {
      return { success: false, error: 'GitHub sign-in is not configured yet.' }
    }

    const parsed = signInWithGitHubSchema.safeParse({
      callbackURL: formData.get('callbackURL') ?? '/dashboard',
    })

    if (!parsed.success) {
      return { success: false, error: getValidationError(parsed.error) }
    }

    context.observe.setAttributes({
      'auth.action': 'sign_in',
      'auth.provider': 'github',
      'auth.redirect_to': parsed.data.callbackURL,
    })

    const { data, error } = await tryCatch(
      auth.api.signInSocial({
        body: {
          callbackURL: parsed.data.callbackURL,
          provider: 'github',
        },
      })
    )

    if (error || !data?.url) {
      return { success: false, error: 'Unable to start GitHub sign-in right now.' }
    }

    context.observe.setAttributes({
      success: true,
    })

    redirect(data.url)
  }
)

export const signOut = withServerAction('auth_sign_out', async (context) => {
  const session = await getSession()

  context.observe.setAttributes({
    'auth.action': 'sign_out',
    'user.id': session?.user.id,
  })

  const { error } = await tryCatch(
    auth.api.signOut({
      headers: await headers(),
    })
  )

  if (error) {
    return
  }

  context.observe.setAttributes({
    success: true,
  })

  redirect('/')
})

'use server'

import { redirect } from 'next/navigation'
import type { z } from 'zod'

import { auth, isGitHubAuthEnabled } from '~/server/better-auth'
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

export const signInWithEmail = async (_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> => {
  const parsed = signInWithEmailSchema.safeParse({
    callbackURL: formData.get('callbackURL') ?? '/',
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
  }

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

  redirect(parsed.data.callbackURL)
}

export const signUpWithEmail = async (_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> => {
  const parsed = signUpWithEmailSchema.safeParse({
    callbackURL: formData.get('callbackURL') ?? '/',
    email: formData.get('email'),
    name: formData.get('name'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
  }

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

  redirect(parsed.data.callbackURL)
}

export const signInWithGitHub = async (_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> => {
  if (!isGitHubAuthEnabled) {
    return { success: false, error: 'GitHub sign-in is not configured yet.' }
  }

  const parsed = signInWithGitHubSchema.safeParse({
    callbackURL: formData.get('callbackURL') ?? '/',
  })

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
  }

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

  redirect(data.url)
}

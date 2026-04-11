import { z } from 'zod'

export type AuthActionState = {
  success: boolean
  error?: string
}

export const initialAuthActionState: AuthActionState = {
  success: false,
}

const callbackURLSchema = z.object({
  callbackURL: z.string().startsWith('/').default('/'),
})

export const signInWithEmailSchema = callbackURLSchema.extend({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export const signUpWithEmailSchema = callbackURLSchema.extend({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export const signInWithGitHubSchema = callbackURLSchema

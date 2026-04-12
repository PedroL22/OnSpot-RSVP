import type { RsvpStatus } from '@prisma/client'

export type ActionFieldErrors = Record<string, string[]>

export type ActionState = {
  success: boolean
  message?: string
  fieldErrors?: ActionFieldErrors
}

export const initialActionState: ActionState = {
  success: false,
}

export type CreateRsvpState = ActionState & {
  rsvpStatus?: RsvpStatus
}

export const initialCreateRsvpState: CreateRsvpState = {
  success: false,
}

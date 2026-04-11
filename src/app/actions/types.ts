export type ActionFieldErrors = Record<string, string[]>

export type ActionState = {
  success: boolean
  message?: string
  fieldErrors?: ActionFieldErrors
}

export const initialActionState: ActionState = {
  success: false,
}

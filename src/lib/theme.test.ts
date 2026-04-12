import { describe, expect, it } from 'vitest'

import { resolveInitialTheme } from './theme'

describe('resolveInitialTheme', () => {
  it('returns dark when the stored theme is dark', () => {
    expect(resolveInitialTheme('dark', false)).toBe('dark')
  })

  it('returns light when the stored theme is light', () => {
    expect(resolveInitialTheme('light', true)).toBe('light')
  })

  it('returns dark when the stored theme is unset and the system prefers dark', () => {
    expect(resolveInitialTheme(undefined, true)).toBe('dark')
  })

  it('returns light when the stored theme is unset and the system prefers light', () => {
    expect(resolveInitialTheme(undefined, false)).toBe('light')
  })
})

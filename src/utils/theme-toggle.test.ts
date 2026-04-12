import { describe, expect, it, vi } from 'vitest'

import { getNextTheme, toggleTheme } from './theme-toggle'

describe('getNextTheme', () => {
  it('returns light when the current preference is system and the resolved theme is dark', () => {
    expect(getNextTheme('system', 'dark')).toBe('light')
  })

  it('returns dark when the current preference is system and the resolved theme is light', () => {
    expect(getNextTheme('system', 'light')).toBe('dark')
  })

  it('returns light when the preference is unset and the resolved theme is dark', () => {
    expect(getNextTheme(undefined, 'dark')).toBe('light')
  })

  it('returns dark when the preference is unset and the resolved theme is light', () => {
    expect(getNextTheme(undefined, 'light')).toBe('dark')
  })

  it('returns system when the current preference is dark', () => {
    expect(getNextTheme('dark', 'dark')).toBe('system')
  })

  it('returns system when the current preference is light', () => {
    expect(getNextTheme('light', 'light')).toBe('system')
  })
})

describe('toggleTheme', () => {
  it('sets the next theme directly', () => {
    const setTheme = vi.fn()

    toggleTheme({
      theme: 'system',
      resolvedTheme: 'dark',
      setTheme,
    })

    expect(setTheme).toHaveBeenCalledWith('light')
  })
})

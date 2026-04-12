import { describe, expect, it } from 'vitest'

import { sanitizeCallbackURL } from './callback-url'

describe('sanitizeCallbackURL', () => {
  it('accepts internal callback paths', () => {
    expect(sanitizeCallbackURL('/dashboard')).toBe('/dashboard')
  })

  it('accepts internal callback paths with query strings and hashes', () => {
    expect(sanitizeCallbackURL('/dashboard?tab=waitlist#top')).toBe('/dashboard?tab=waitlist#top')
  })

  it('rejects protocol-relative callback URLs', () => {
    expect(sanitizeCallbackURL('//evil.com')).toBe('/dashboard')
  })

  it('rejects absolute callback URLs', () => {
    expect(sanitizeCallbackURL('https://evil.com')).toBe('/dashboard')
  })

  it('rejects javascript callback URLs', () => {
    expect(sanitizeCallbackURL('javascript:alert(1)')).toBe('/dashboard')
  })

  it('rejects callback URLs with backslashes', () => {
    expect(sanitizeCallbackURL('/\\evil.com')).toBe('/dashboard')
  })

  it('falls back for empty or undefined callback URLs', () => {
    expect(sanitizeCallbackURL('')).toBe('/dashboard')
    expect(sanitizeCallbackURL(undefined)).toBe('/dashboard')
  })
})

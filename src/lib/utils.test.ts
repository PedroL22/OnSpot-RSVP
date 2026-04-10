import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('merges conditional classes', () => {
    expect(cn('flex', false && 'hidden', 'items-center')).toBe('flex items-center')
  })

  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })
})

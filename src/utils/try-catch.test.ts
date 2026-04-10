import { describe, expect, it } from 'vitest'

import { tryCatch } from './try-catch'

describe('tryCatch', () => {
  it('returns data when the promise resolves', async () => {
    const result = await tryCatch(Promise.resolve('ok'))

    expect(result).toEqual({ data: 'ok', error: null })
  })

  it('returns the error when the promise rejects', async () => {
    const failure = new Error('boom')

    const result = await tryCatch(Promise.reject(failure))

    expect(result).toEqual({ data: null, error: failure })
  })
})

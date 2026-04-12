import { beforeEach, describe, expect, it, vi } from 'vitest'

const unstableRethrowMock = vi.fn()

vi.mock('next/navigation', () => ({
  unstable_rethrow: unstableRethrowMock,
}))

describe('withServerAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs exactly one structured line for successful actions', async () => {
    const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(() => {})
    const { withServerAction } = await import('./server-action')

    const action = withServerAction('test_action', async (context, name: string) => {
      context.observe.setAttributes({
        'user.id': 'user_123',
      })

      return {
        greeting: `Hello ${name}`,
        success: true,
      }
    })

    await expect(action('Alex')).resolves.toEqual({
      greeting: 'Hello Alex',
      success: true,
    })

    expect(consoleInfoMock).toHaveBeenCalledTimes(1)
    expect(unstableRethrowMock).not.toHaveBeenCalled()

    const payload = JSON.parse(consoleInfoMock.mock.calls[0]?.[0] as string)

    expect(payload).toMatchObject({
      action: 'test_action',
      success: true,
      type: 'server_action',
      'user.id': 'user_123',
    })
    expect(typeof payload.durationMs).toBe('number')
    expect(typeof payload.timestamp).toBe('string')

    consoleInfoMock.mockRestore()
  })

  it('logs exactly one structured line for thrown errors and rethrows the original error', async () => {
    const consoleInfoMock = vi.spyOn(console, 'info').mockImplementation(() => {})
    const { withServerAction } = await import('./server-action')
    const thrownError = new Error('boom')

    const action = withServerAction('test_action', async (context) => {
      context.observe.setAttributes({
        'user.id': 'user_123',
      })

      throw thrownError
    })

    await expect(action()).rejects.toBe(thrownError)

    expect(consoleInfoMock).toHaveBeenCalledTimes(1)
    expect(unstableRethrowMock).toHaveBeenCalledWith(thrownError)

    const payload = JSON.parse(consoleInfoMock.mock.calls[0]?.[0] as string)

    expect(payload).toMatchObject({
      action: 'test_action',
      error: 'boom',
      success: false,
      type: 'server_action',
      'user.id': 'user_123',
    })

    consoleInfoMock.mockRestore()
  })
})

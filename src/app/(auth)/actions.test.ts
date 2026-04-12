import { beforeEach, describe, expect, it, vi } from 'vitest'

const redirectMock = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`)
})

const getSessionMock = vi.fn()
const headersMock = vi.fn(() => new Headers())
const signInEmailMock = vi.fn()
const signOutMock = vi.fn()
const signUpEmailMock = vi.fn()
const signInSocialMock = vi.fn()

const loadActions = async ({ githubEnabled = true }: { githubEnabled?: boolean } = {}) => {
  vi.resetModules()

  vi.doMock('next/navigation', () => ({
    redirect: redirectMock,
  }))

  vi.doMock('next/headers', () => ({
    headers: headersMock,
  }))

  vi.doMock('~/server/better-auth', () => ({
    auth: {
      api: {
        signInEmail: signInEmailMock,
        signInSocial: signInSocialMock,
        signOut: signOutMock,
        signUpEmail: signUpEmailMock,
      },
    },
    isGitHubAuthEnabled: githubEnabled,
  }))

  vi.doMock('~/server/better-auth/server', () => ({
    getSession: getSessionMock,
  }))

  vi.doMock('~/server/observability/server-action', () => ({
    withServerAction:
      (_actionName: string, handler: (...args: unknown[]) => Promise<unknown>) =>
      (...args: unknown[]) =>
        handler(
          {
            observe: {
              setAttributes: vi.fn(),
            },
          },
          ...args
        ),
  }))

  return import('./actions')
}

describe('auth actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects invalid sign-in email input', async () => {
    const { signInWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('email', 'invalid-email')
    formData.set('password', 'password123')

    await expect(signInWithEmail({ success: false }, formData)).resolves.toEqual({
      success: false,
      error: 'Enter a valid email address.',
    })
    expect(signInEmailMock).not.toHaveBeenCalled()
  })

  it('rejects short sign-in passwords', async () => {
    const { signInWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('email', 'alex@onspot.app')
    formData.set('password', 'short')

    await expect(signInWithEmail({ success: false }, formData)).resolves.toEqual({
      success: false,
      error: 'Password must be at least 8 characters.',
    })
    expect(signInEmailMock).not.toHaveBeenCalled()
  })

  it('redirects after successful email sign-in', async () => {
    signInEmailMock.mockResolvedValue({ token: 'session_token' })

    const { signInWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('callbackURL', '/')
    formData.set('email', 'alex@onspot.app')
    formData.set('password', 'password123')

    await expect(signInWithEmail({ success: false }, formData)).rejects.toThrow('REDIRECT:/')
    expect(signInEmailMock).toHaveBeenCalledWith({
      body: {
        callbackURL: '/',
        email: 'alex@onspot.app',
        password: 'password123',
      },
    })
  })

  it('sanitizes malicious sign-in callback URLs before calling Better Auth and redirecting', async () => {
    signInEmailMock.mockResolvedValue({ token: 'session_token' })

    const { signInWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('callbackURL', '//evil.com')
    formData.set('email', 'alex@onspot.app')
    formData.set('password', 'password123')

    await expect(signInWithEmail({ success: false }, formData)).rejects.toThrow('REDIRECT:/dashboard')
    expect(signInEmailMock).toHaveBeenCalledWith({
      body: {
        callbackURL: '/dashboard',
        email: 'alex@onspot.app',
        password: 'password123',
      },
    })
  })

  it('rejects empty sign-up names', async () => {
    const { signUpWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('name', '')
    formData.set('email', 'alex@onspot.app')
    formData.set('password', 'password123')

    await expect(signUpWithEmail({ success: false }, formData)).resolves.toEqual({
      success: false,
      error: 'Name is required.',
    })
    expect(signUpEmailMock).not.toHaveBeenCalled()
  })

  it('rejects invalid sign-up emails', async () => {
    const { signUpWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('name', 'Alex')
    formData.set('email', 'invalid-email')
    formData.set('password', 'password123')

    await expect(signUpWithEmail({ success: false }, formData)).resolves.toEqual({
      success: false,
      error: 'Enter a valid email address.',
    })
    expect(signUpEmailMock).not.toHaveBeenCalled()
  })

  it('rejects short sign-up passwords', async () => {
    const { signUpWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('name', 'Alex')
    formData.set('email', 'alex@onspot.app')
    formData.set('password', 'short')

    await expect(signUpWithEmail({ success: false }, formData)).resolves.toEqual({
      success: false,
      error: 'Password must be at least 8 characters.',
    })
    expect(signUpEmailMock).not.toHaveBeenCalled()
  })

  it('redirects after successful email sign-up', async () => {
    signUpEmailMock.mockResolvedValue({ token: 'session_token' })

    const { signUpWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('callbackURL', '/')
    formData.set('name', 'Alex')
    formData.set('email', 'alex@onspot.app')
    formData.set('password', 'password123')

    await expect(signUpWithEmail({ success: false }, formData)).rejects.toThrow('REDIRECT:/')
    expect(signUpEmailMock).toHaveBeenCalledWith({
      body: {
        callbackURL: '/',
        email: 'alex@onspot.app',
        name: 'Alex',
        password: 'password123',
      },
    })
  })

  it('sanitizes malicious sign-up callback URLs before calling Better Auth and redirecting', async () => {
    signUpEmailMock.mockResolvedValue({ token: 'session_token' })

    const { signUpWithEmail } = await loadActions()
    const formData = new FormData()
    formData.set('callbackURL', '//evil.com')
    formData.set('name', 'Alex')
    formData.set('email', 'alex@onspot.app')
    formData.set('password', 'password123')

    await expect(signUpWithEmail({ success: false }, formData)).rejects.toThrow('REDIRECT:/dashboard')
    expect(signUpEmailMock).toHaveBeenCalledWith({
      body: {
        callbackURL: '/dashboard',
        email: 'alex@onspot.app',
        name: 'Alex',
        password: 'password123',
      },
    })
  })

  it('returns a clear error when GitHub auth is disabled', async () => {
    const { signInWithGitHub } = await loadActions({ githubEnabled: false })
    const formData = new FormData()
    formData.set('callbackURL', '/')

    await expect(signInWithGitHub({ success: false }, formData)).resolves.toEqual({
      success: false,
      error: 'GitHub sign-in is not configured yet.',
    })
    expect(signInSocialMock).not.toHaveBeenCalled()
  })

  it('sanitizes malicious GitHub callback URLs before starting OAuth', async () => {
    signInSocialMock.mockResolvedValue({ url: 'https://github.com/login/oauth/authorize?state=test' })

    const { signInWithGitHub } = await loadActions()
    const formData = new FormData()
    formData.set('callbackURL', '//evil.com')

    await expect(signInWithGitHub({ success: false }, formData)).rejects.toThrow(
      'REDIRECT:https://github.com/login/oauth/authorize?state=test'
    )
    expect(signInSocialMock).toHaveBeenCalledWith({
      body: {
        callbackURL: '/dashboard',
        provider: 'github',
      },
    })
  })

  it('signs the current user out and redirects home', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    signOutMock.mockResolvedValue({})

    const { signOut } = await loadActions()

    await expect(signOut()).rejects.toThrow('REDIRECT:/')
    expect(signOutMock).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    })
  })
})

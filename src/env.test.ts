import { afterEach, describe, expect, it, vi } from 'vitest'

const originalEnv = { ...process.env }

const loadEnv = async (overrides: Record<string, string | undefined> = {}) => {
  vi.resetModules()

  process.env = {
    ...originalEnv,
    BETTER_AUTH_SECRET: 'test-secret',
    BETTER_AUTH_URL: 'http://localhost:3000',
    DATABASE_URL: 'postgresql://postgres:password@db.example.co:5432/postgres',
    NODE_ENV: 'test',
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key]
      continue
    }

    process.env[key] = value
  }

  return import('./env')
}

describe('env', () => {
  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('allows GitHub credentials to be omitted together', async () => {
    const { env } = await loadEnv({
      BETTER_AUTH_GITHUB_CLIENT_ID: undefined,
      BETTER_AUTH_GITHUB_CLIENT_SECRET: undefined,
    })

    expect(env.BETTER_AUTH_GITHUB_CLIENT_ID).toBeUndefined()
    expect(env.BETTER_AUTH_GITHUB_CLIENT_SECRET).toBeUndefined()
  })

  it('rejects a partial GitHub OAuth configuration', async () => {
    await expect(
      loadEnv({
        BETTER_AUTH_GITHUB_CLIENT_ID: 'github-client-id',
        BETTER_AUTH_GITHUB_CLIENT_SECRET: undefined,
      })
    ).rejects.toThrow(
      'BETTER_AUTH_GITHUB_CLIENT_ID and BETTER_AUTH_GITHUB_CLIENT_SECRET must both be set or both be empty.'
    )
  })
})

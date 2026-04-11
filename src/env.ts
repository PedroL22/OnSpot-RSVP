import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_GITHUB_CLIENT_ID: z.string().min(1).optional(),
    BETTER_AUTH_GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_GITHUB_CLIENT_ID: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
    BETTER_AUTH_GITHUB_CLIENT_SECRET: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})

const githubEnvPair = z
  .object({
    BETTER_AUTH_GITHUB_CLIENT_ID: z.string().min(1).optional(),
    BETTER_AUTH_GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
  })
  .refine(
    ({ BETTER_AUTH_GITHUB_CLIENT_ID, BETTER_AUTH_GITHUB_CLIENT_SECRET }) =>
      (!BETTER_AUTH_GITHUB_CLIENT_ID && !BETTER_AUTH_GITHUB_CLIENT_SECRET) ||
      (BETTER_AUTH_GITHUB_CLIENT_ID && BETTER_AUTH_GITHUB_CLIENT_SECRET),
    {
      message: 'BETTER_AUTH_GITHUB_CLIENT_ID and BETTER_AUTH_GITHUB_CLIENT_SECRET must both be set or both be empty.',
    }
  )

const githubEnvPairResult = githubEnvPair.safeParse({
  BETTER_AUTH_GITHUB_CLIENT_ID: env.BETTER_AUTH_GITHUB_CLIENT_ID,
  BETTER_AUTH_GITHUB_CLIENT_SECRET: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
})

if (!githubEnvPairResult.success) {
  throw new Error(githubEnvPairResult.error.issues[0]?.message ?? 'Invalid Better Auth GitHub environment variables.')
}

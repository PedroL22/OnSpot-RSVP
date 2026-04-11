import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'

import { env } from '~/env'
import { db } from '~/server/db'

const githubProviderConfig =
  env.BETTER_AUTH_GITHUB_CLIENT_ID && env.BETTER_AUTH_GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
        },
      }
    : undefined

export const isGitHubAuthEnabled = Boolean(githubProviderConfig)

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  ...(githubProviderConfig ? { socialProviders: githubProviderConfig } : {}),
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session

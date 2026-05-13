import { Prisma } from '@prisma/client'

import { db } from '~/server/db'
import { tryCatch } from '~/utils/try-catch'

const isSerializableConflict = (error: unknown) => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034'
}

export const runSerializableTransaction = async <T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: { maxAttempts?: number }
) => {
  const maxAttempts = Math.max(1, options?.maxAttempts ?? 3)

  const attemptTransaction = async (attempt: number): Promise<T> => {
    const { data, error } = await tryCatch(
      db.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      })
    )

    if (!error) {
      return data
    }

    if (!isSerializableConflict(error) || attempt === maxAttempts) {
      throw error
    }

    return attemptTransaction(attempt + 1)
  }

  return attemptTransaction(1)
}

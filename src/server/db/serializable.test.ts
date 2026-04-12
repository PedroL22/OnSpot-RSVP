import { Prisma } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const transactionMock = vi.fn()

vi.mock('~/server/db', () => ({
  db: {
    $transaction: transactionMock,
  },
}))

const createPrismaError = (code: string) => {
  return new Prisma.PrismaClientKnownRequestError('transaction failed', {
    clientVersion: 'test',
    code,
  })
}

describe('runSerializableTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retries on serializable write conflicts and resolves once a later attempt succeeds', async () => {
    transactionMock.mockRejectedValueOnce(createPrismaError('P2034')).mockResolvedValueOnce('ok')

    const { runSerializableTransaction } = await import('./serializable')

    await expect(runSerializableTransaction(async () => 'unused')).resolves.toBe('ok')
    expect(transactionMock).toHaveBeenCalledTimes(2)
    expect(transactionMock).toHaveBeenNthCalledWith(1, expect.any(Function), {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    })
  })

  it('stops retrying after the first successful attempt', async () => {
    transactionMock.mockResolvedValueOnce('ok')

    const { runSerializableTransaction } = await import('./serializable')

    await expect(runSerializableTransaction(async () => 'unused')).resolves.toBe('ok')
    expect(transactionMock).toHaveBeenCalledTimes(1)
  })

  it('does not retry non-serializable errors', async () => {
    const error = new Error('database down')
    transactionMock.mockRejectedValueOnce(error)

    const { runSerializableTransaction } = await import('./serializable')

    await expect(runSerializableTransaction(async () => 'unused')).rejects.toBe(error)
    expect(transactionMock).toHaveBeenCalledTimes(1)
  })
})

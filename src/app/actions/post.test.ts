import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSessionMock = vi.fn()
const createMock = vi.fn()
const revalidatePathMock = vi.fn()

vi.mock('next/cache', () => ({
  revalidatePath: revalidatePathMock,
}))

vi.mock('~/server/better-auth/server', () => ({
  getSession: getSessionMock,
}))

vi.mock('~/server/db', () => ({
  db: {
    post: {
      create: createMock,
    },
  },
}))

describe('createPost', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns unauthorized when there is no session user', async () => {
    getSessionMock.mockResolvedValue(null)

    const { createPost } = await import('./post')

    const result = await createPost({ success: false }, new FormData())

    expect(result).toEqual({ success: false, error: 'Unauthorized' })
    expect(createMock).not.toHaveBeenCalled()
    expect(revalidatePathMock).not.toHaveBeenCalled()
  })

  it('returns a validation error when the title is empty', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })

    const { createPost } = await import('./post')
    const formData = new FormData()
    formData.set('name', '')

    const result = await createPost({ success: false }, formData)

    expect(result).toEqual({ success: false, error: 'Post title cannot be empty.' })
    expect(createMock).not.toHaveBeenCalled()
    expect(revalidatePathMock).not.toHaveBeenCalled()
  })

  it('creates a post and revalidates the home page on success', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    createMock.mockResolvedValue({ id: 'post_123' })

    const { createPost } = await import('./post')
    const formData = new FormData()
    formData.set('name', 'Launch party')

    const result = await createPost({ success: false }, formData)

    expect(result).toEqual({ success: true })
    expect(createMock).toHaveBeenCalledWith({
      data: {
        name: 'Launch party',
        createdBy: { connect: { id: 'user_123' } },
      },
    })
    expect(revalidatePathMock).toHaveBeenCalledWith('/')
  })

  it('returns a failure state when the database write fails', async () => {
    getSessionMock.mockResolvedValue({ user: { id: 'user_123' } })
    createMock.mockRejectedValue(new Error('db failed'))

    const { createPost } = await import('./post')
    const formData = new FormData()
    formData.set('name', 'Launch party')

    const result = await createPost({ success: false }, formData)

    expect(result).toEqual({ success: false, error: 'Failed to create post.' })
    expect(revalidatePathMock).not.toHaveBeenCalled()
  })
})

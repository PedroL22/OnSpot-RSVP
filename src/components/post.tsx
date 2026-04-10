'use client'

import { useActionState, useEffect, useRef } from 'react'

import { type CreatePostState, createPost } from '~/app/actions/post'

import type { Post } from 'generated/prisma'

const initialState: CreatePostState = { success: false }

export const LatestPost = ({ latestPost }: { latestPost: Post | null }) => {
  const [state, formAction, isPending] = useActionState(createPost, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <div className='w-full max-w-xs'>
      {latestPost ? (
        <p className='truncate'>Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form action={formAction} className='flex flex-col gap-2' ref={formRef}>
        <input
          className='w-full rounded-full bg-white/10 px-4 py-2 text-white'
          name='name'
          placeholder='Title'
          type='text'
        />
        {state.error && <p className='text-center text-red-400 text-sm'>{state.error}</p>}
        <button
          className='rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20'
          disabled={isPending}
          type='submit'
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

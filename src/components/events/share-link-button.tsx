'use client'

import { useState } from 'react'

type ShareLinkButtonProps = {
  shareUrl: string
}

export const ShareLinkButton = ({ shareUrl }: ShareLinkButtonProps) => {
  const [message, setMessage] = useState('Copy link')

  const resetMessage = () => {
    window.setTimeout(() => setMessage('Copy link'), 1800)
  }

  const handleCopy = () => {
    void navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setMessage('Copied')
        resetMessage()
      })
      .catch(() => {
        setMessage('Copy failed')
        resetMessage()
      })
  }

  return (
    <button
      className='inline-flex items-center justify-center rounded-full border border-[#111827]/10 bg-white px-4 py-2 font-medium text-[#111827] text-sm transition hover:border-[#111827]/20 hover:bg-[#faf7f2]'
      onClick={handleCopy}
      type='button'
    >
      {message}
    </button>
  )
}

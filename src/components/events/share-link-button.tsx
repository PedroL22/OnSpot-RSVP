'use client'

import { useState } from 'react'

import { CheckIcon, CopySimpleIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '~/components/ui/button'

type ShareLinkButtonProps = {
  shareUrl: string
}

export const ShareLinkButton = ({ shareUrl }: ShareLinkButtonProps) => {
  const [copied, setCopied] = useState(false)

  const resetState = () => {
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleCopy = () => {
    void navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true)
        resetState()
      })
      .catch(() => {
        // Silently fail.
      })
  }

  return (
    <Button
      className='w-32 text-[0.72rem] uppercase tracking-[0.16em]'
      onClick={handleCopy}
      type='button'
      variant={copied ? 'secondary' : 'outline'}
    >
      {copied ? (
        <>
          <CheckIcon data-icon='inline-start' weight='bold' />
          Copied
        </>
      ) : (
        <>
          <CopySimpleIcon data-icon='inline-start' />
          Share link
        </>
      )}
    </Button>
  )
}

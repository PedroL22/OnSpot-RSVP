'use client'

import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react/dist/ssr'
import * as React from 'react'

import { cn } from '~/lib/utils'
import { Input } from '~/components/ui/input'

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>

export const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className='relative'>
      <Input {...props} className={cn('pr-10', className)} type={isVisible ? 'text' : 'password'} />
      <button
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        aria-pressed={isVisible}
        className='absolute top-1/2 right-1 z-10 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
        onClick={() => setIsVisible((current) => !current)}
        onMouseDown={(event) => event.preventDefault()}
        type='button'
      >
        {isVisible ? <EyeSlashIcon aria-hidden /> : <EyeIcon aria-hidden />}
      </button>
    </div>
  )
}

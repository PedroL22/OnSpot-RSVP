'use client'

import { useTheme } from 'next-themes'

import { MoonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '~/components/ui/button'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button aria-label='Toggle theme' onClick={toggleTheme} size='icon-sm' type='button' variant='ghost'>
      <SunIcon aria-hidden className='hidden size-4 dark:block' />
      <MoonIcon aria-hidden className='size-4 dark:hidden' />
    </Button>
  )
}

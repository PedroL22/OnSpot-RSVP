'use client'

import { useTheme } from 'next-themes'

import { MoonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '~/components/ui/button'

import { toggleTheme } from '~/utils/theme-toggle'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme, theme } = useTheme()

  const handleToggleTheme = () => {
    toggleTheme({
      theme,
      resolvedTheme,
      setTheme,
    })
  }

  return (
    <Button aria-label='Toggle theme' onClick={handleToggleTheme} size='icon-sm' type='button' variant='ghost'>
      <SunIcon aria-hidden className='hidden size-4 dark:block' />
      <MoonIcon aria-hidden className='size-4 dark:hidden' />
    </Button>
  )
}

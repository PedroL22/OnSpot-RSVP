'use client'

import { Moon, Sun } from '@phosphor-icons/react/dist/ssr'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button aria-label='Toggle theme' onClick={toggleTheme} size='icon-sm' type='button' variant='ghost'>
      {mounted ? resolvedTheme === 'dark' ? <Sun /> : <Moon /> : <span className='size-4' />}
    </Button>
  )
}

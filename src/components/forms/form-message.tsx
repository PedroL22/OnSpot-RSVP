import type { ReactNode } from 'react'

import { Alert, AlertDescription } from '~/components/ui/alert'

import { cn } from '~/lib/utils'

type FormMessageProps = {
  children: ReactNode
  className?: string
  tone?: 'default' | 'destructive' | 'success'
}

export const FormMessage = ({ children, className, tone = 'default' }: FormMessageProps) => {
  if (!children) {
    return null
  }

  if (tone === 'success') {
    return (
      <Alert className={cn('border-success/20 bg-success/10 text-success', className)}>
        <AlertDescription className='text-success'>{children}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className={className} variant={tone === 'destructive' ? 'destructive' : 'default'}>
      <AlertDescription className={tone === 'destructive' ? 'text-destructive' : undefined}>
        {children}
      </AlertDescription>
    </Alert>
  )
}

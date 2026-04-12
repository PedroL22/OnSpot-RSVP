import type { ReactNode } from 'react'

import { Label } from '~/components/ui/label'

import { cn } from '~/lib/utils'

type FormFieldProps = {
  children: ReactNode
  className?: string
  description?: ReactNode
  error?: ReactNode
  htmlFor?: string
  label: ReactNode
}

export const FormField = ({ children, className, description, error, htmlFor, label }: FormFieldProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label className='font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]' htmlFor={htmlFor}>
        {label}
      </Label>

      {children}
      {!!description && <p className='text-muted-foreground text-sm'>{description}</p>}
      {!!error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  )
}

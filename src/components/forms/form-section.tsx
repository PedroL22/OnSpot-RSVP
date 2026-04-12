import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

type FormSectionProps = {
  children: ReactNode
  className?: string
  columns?: 1 | 2
}

export const FormSection = ({ children, className, columns = 1 }: FormSectionProps) => {
  return (
    <div className={cn(columns === 2 ? 'grid gap-5 sm:grid-cols-2' : 'flex flex-col gap-5', className)}>{children}</div>
  )
}

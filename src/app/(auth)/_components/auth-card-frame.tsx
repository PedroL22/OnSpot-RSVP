import type { ReactNode } from 'react'

import { Eyebrow } from '~/components/layout/eyebrow'
import { Card, CardContent, CardHeader } from '~/components/ui/card'

type AuthCardFrameProps = {
  children: ReactNode
  description: string
}

export const AuthCardFrame = ({ children, description }: AuthCardFrameProps) => {
  return (
    <Card className='border-border/80 bg-card/95 py-0 shadow-(--shadow-md)'>
      <div className='h-1 w-full bg-primary' />

      <CardHeader className='px-8 pt-4'>
        <Eyebrow>Account access</Eyebrow>
        <p className='text-muted-foreground text-sm leading-relaxed'>{description}</p>
      </CardHeader>

      <CardContent className='px-8 pb-8'>{children}</CardContent>
    </Card>
  )
}

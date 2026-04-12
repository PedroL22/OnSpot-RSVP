import type { ReactNode } from 'react'

import { Card, CardContent } from '~/components/ui/card'

import { DisplayTitle } from '../../components/layout/display-title'
import { Eyebrow } from '../../components/layout/eyebrow'

type AuthCalloutCardProps = {
  body: ReactNode
  intro: string
  title: ReactNode
}

export const AuthCalloutCard = ({ body, intro, title }: AuthCalloutCardProps) => {
  return (
    <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-[var(--shadow-md)]'>
      <div className='h-1 w-full bg-primary' />
      <CardContent className='space-y-8 px-8 py-8'>
        <div className='space-y-3'>
          <Eyebrow>{intro}</Eyebrow>
          <DisplayTitle size='md'>{title}</DisplayTitle>
        </div>
        <div className='space-y-3'>{body}</div>
      </CardContent>
    </Card>
  )
}

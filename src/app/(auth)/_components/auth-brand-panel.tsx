import { ShieldCheckeredIcon } from '@phosphor-icons/react/dist/ssr'

import { BrandMark } from '~/components/brand/brand-mark'
import { DisplayTitle } from '~/components/layout/display-title'
import { Eyebrow } from '~/components/layout/eyebrow'
import { Card, CardContent } from '~/components/ui/card'

type AuthBrandPanelProps = {
  description: string
  title: string
}

export const AuthBrandPanel = ({ description, title }: AuthBrandPanelProps) => {
  return (
    <div className='relative hidden overflow-hidden border-border border-r bg-card/70 lg:flex lg:w-[45%] xl:w-[42%]'>
      <div className='absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-size-[40px_40px] opacity-35' />
      <div className='absolute top-0 left-0 size-96 bg-[radial-gradient(circle_at_20%_20%,rgba(0,166,244,0.12),transparent_60%)]' />
      <div className='relative z-10 flex w-full flex-col justify-between p-12 xl:p-16'>
        <BrandMark />

        <div className='mt-8 space-y-8'>
          <div className='space-y-6'>
            <DisplayTitle size='lg'>{title}</DisplayTitle>

            <p className='max-w-xs text-muted-foreground text-sm leading-relaxed'>{description}</p>
          </div>

          <div className='grid max-w-xs gap-3'>
            <Card className='bg-background/70 py-0 shadow-none'>
              <CardContent className='space-y-2 px-4 py-4'>
                <Eyebrow>Fast path</Eyebrow>
                <p className='text-foreground text-sm'>Email and password work out of the box.</p>
              </CardContent>
            </Card>

            <Card className='bg-background/70 py-0 shadow-none'>
              <CardContent className='space-y-2 px-4 py-4'>
                <Eyebrow>Flexible entry</Eyebrow>
                <p className='text-foreground text-sm'>GitHub appears when OAuth keys exist.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='mt-6 flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]'>
          <ShieldCheckeredIcon className='size-4 text-primary' />
          Secure auth
        </div>
      </div>
    </div>
  )
}

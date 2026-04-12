import Link from 'next/link'
import type { ReactNode } from 'react'

import { BrandMark } from '~/components/brand/brand-mark'
import { PatternBackground } from '~/components/layout/pattern-background'
import { buttonVariants } from '~/components/ui/button'
import { AuthBrandPanel } from './auth-brand-panel'
import { AuthCardFrame } from './auth-card-frame'

import { cn } from '~/lib/utils'

type AuthShellProps = {
  alternateHref: string
  alternateLabel: string
  alternateText: string
  children: ReactNode
  description: string
  title: string
}

export const AuthShell = ({
  alternateHref,
  alternateLabel,
  alternateText,
  children,
  description,
  title,
}: AuthShellProps) => {
  return (
    <main className='flex min-h-screen bg-background'>
      <PatternBackground className='opacity-70 lg:hidden' />

      <AuthBrandPanel description={description} title={title} />

      <div className='relative flex flex-1 items-center justify-center p-6 lg:p-12'>
        <PatternBackground className='hidden opacity-70 lg:block' />

        <div className='relative z-10 w-full max-w-md animate-[fade-up_0.5s_var(--ease-out-expo)_both]'>
          <div className='mb-10 lg:hidden'>
            <BrandMark />
          </div>

          <AuthCardFrame description={description}>
            <div className='space-y-8'>
              {children}

              <div className='border-border border-t pt-6'>
                <p className='font-mono text-[11px] text-muted-foreground'>
                  {alternateLabel}{' '}
                  <Link
                    className={cn(buttonVariants({ variant: 'link' }), 'h-auto px-0 py-0 text-[11px]')}
                    href={alternateHref}
                  >
                    {alternateText}
                  </Link>
                </p>
              </div>
            </div>
          </AuthCardFrame>
        </div>
      </div>
    </main>
  )
}

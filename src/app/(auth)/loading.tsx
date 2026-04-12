import { BrandMark } from '~/components/brand/brand-mark'
import { PatternBackground } from '~/components/layout/pattern-background'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

export default function AuthLoading() {
  return (
    <main className='flex min-h-screen bg-background'>
      <PatternBackground className='opacity-70 lg:hidden' />

      <div className='relative hidden overflow-hidden border-border border-r bg-card/70 lg:flex lg:w-[45%] xl:w-[42%]'>
        <div className='absolute inset-0 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-size-[40px_40px] opacity-35' />
        <div className='absolute top-0 left-0 size-96 bg-[radial-gradient(circle_at_20%_20%,rgba(0,166,244,0.12),transparent_60%)]' />

        <div className='relative z-10 flex w-full flex-col justify-between p-12 xl:p-16'>
          <BrandMark />

          <div className='mt-8 space-y-8'>
            <div className='space-y-6'>
              <div className='space-y-3'>
                <Skeleton className='h-3 w-28' />
                <Skeleton className='h-12 w-72' />
                <Skeleton className='h-12 w-64' />
              </div>

              <div className='space-y-2'>
                <Skeleton className='h-4 w-64' />
                <Skeleton className='h-4 w-56' />
              </div>
            </div>

            <div className='grid max-w-xs gap-3'>
              <Skeleton className='h-24 rounded-xl' />
              <Skeleton className='h-24 rounded-xl' />
            </div>
          </div>

          <Skeleton className='h-4 w-28' />
        </div>
      </div>

      <div className='relative flex flex-1 items-center justify-center p-6 lg:p-12'>
        <PatternBackground className='hidden opacity-70 lg:block' />

        <div className='relative z-10 w-full max-w-md animate-[fade-up_0.5s_var(--ease-out-expo)_both]'>
          <div className='mb-10 lg:hidden'>
            <BrandMark />
          </div>

          <Card className='border-border/80 bg-card/95 py-0 shadow-(--shadow-md)'>
            <div className='h-1 w-full bg-primary' />

            <CardHeader className='space-y-3 px-8 pt-4'>
              <Skeleton className='h-3 w-28' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </CardHeader>

            <CardContent className='space-y-6 px-8 pb-8'>
              <div className='space-y-3'>
                <Skeleton className='h-11 w-full rounded-md' />
                <Skeleton className='h-11 w-full rounded-md' />
              </div>

              <Skeleton className='h-11 w-full rounded-md' />

              <div className='space-y-3 border-border border-t pt-6'>
                <Skeleton className='h-4 w-40' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

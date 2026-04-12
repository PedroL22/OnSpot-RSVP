import { BrandMark } from '~/components/brand/brand-mark'
import { PatternBackground } from '~/components/layout/pattern-background'
import { ThemeToggle } from '~/components/theme-toggle'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

export default function PublicEventLoading() {
  return (
    <main className='relative min-h-screen'>
      <PatternBackground className='opacity-70' />
      <div className='fixed top-0 right-0 left-0 z-50 h-1 bg-primary/80' />
      <div className='pointer-events-none fixed top-0 right-0 size-144 bg-[radial-gradient(circle_at_80%_10%,rgba(0,166,244,0.10),transparent_60%)]' />

      <div className='relative mx-auto max-w-6xl px-6 py-10 lg:px-10 lg:py-16'>
        <header className='mb-12 flex animate-[fade-in_0.4s_ease_both] items-center justify-between gap-4'>
          <BrandMark />

          <div className='flex items-center gap-3'>
            <ThemeToggle />
            <Skeleton className='h-9 w-24 rounded-full' />
          </div>
        </header>

        <div className='grid items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-10'>
          <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-(--shadow-md)'>
            <div className='h-1 w-full bg-primary' />

            <CardContent className='space-y-8 p-8 pt-4 lg:p-10 lg:pt-5'>
              <div className='space-y-4'>
                <Skeleton className='h-3 w-32' />
                <Skeleton className='h-12 w-full max-w-3xl' />
                <Skeleton className='h-12 w-4/5 max-w-2xl' />

                <div className='space-y-3 pt-2'>
                  <Skeleton className='h-5 w-full max-w-2xl' />
                  <Skeleton className='h-5 w-5/6 max-w-xl' />
                </div>
              </div>

              <div className='h-px bg-border' />

              <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                <Skeleton className='h-24 rounded-xl' />
                <Skeleton className='h-24 rounded-xl' />
                <Skeleton className='h-24 rounded-xl' />
                <Skeleton className='h-24 rounded-xl' />
              </div>
            </CardContent>
          </Card>

          <div className='space-y-4'>
            <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-(--shadow-md)'>
              <div className='h-1 w-full bg-primary' />

              <CardHeader className='space-y-4 px-8 pt-6'>
                <Skeleton className='h-3 w-24' />
                <Skeleton className='h-10 w-48' />
                <Skeleton className='h-10 w-36' />
                <div className='space-y-2 pt-1'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                </div>
              </CardHeader>

              <CardContent className='space-y-3 px-8 pb-8'>
                <Skeleton className='h-11 w-full rounded-md' />
                <Skeleton className='h-11 w-full rounded-md' />
                <Skeleton className='h-11 w-full rounded-md' />
                <Skeleton className='h-11 w-full rounded-md' />
              </CardContent>
            </Card>

            <Skeleton className='mx-auto h-4 w-32' />
          </div>
        </div>
      </div>
    </main>
  )
}

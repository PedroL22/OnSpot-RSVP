import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

export default function EventDetailLoading() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-9 w-40 rounded-md' />

      <section className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_128px]'>
        <Card className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-(--shadow-md)'>
          <div className='h-1 w-full bg-primary' />

          <CardContent className='space-y-6 p-8 pt-4'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
              <div className='w-full space-y-4'>
                <div className='flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                  <div className='space-y-4'>
                    <Skeleton className='h-3 w-28' />
                    <Skeleton className='h-12 w-full max-w-2xl' />
                    <Skeleton className='h-12 w-96 max-w-full' />
                  </div>

                  <div className='flex gap-2'>
                    <Skeleton className='h-10 w-28 rounded-md' />
                    <Skeleton className='h-10 w-32 rounded-md' />
                  </div>
                </div>

                <div className='space-y-3'>
                  <Skeleton className='h-4 w-full max-w-2xl' />
                  <Skeleton className='h-4 w-5/6 max-w-xl' />
                </div>
              </div>
            </div>

            <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
              <Skeleton className='h-24 rounded-xl' />
              <Skeleton className='h-24 rounded-xl' />
              <Skeleton className='h-24 rounded-xl' />
              <Skeleton className='h-24 rounded-xl' />
            </div>
          </CardContent>
        </Card>

        <div className='grid gap-3'>
          <Skeleton className='h-28 rounded-xl' />
          <Skeleton className='h-28 rounded-xl' />
          <Skeleton className='h-28 rounded-xl' />
        </div>
      </section>

      <Card className='border-border/80 bg-card/95 py-0 shadow-(--shadow-sm)'>
        <CardHeader className='space-y-3 px-6 pt-6'>
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-9 w-56' />
        </CardHeader>
        <CardContent className='space-y-3 px-6 pb-6'>
          <Skeleton className='h-10 w-full rounded-md' />
          <Skeleton className='h-10 w-full rounded-md' />
          <Skeleton className='h-10 w-full rounded-md' />
          <Skeleton className='h-10 w-full rounded-md' />
        </CardContent>
      </Card>

      <Card className='border-border/80 bg-card/95 py-0 shadow-(--shadow-sm)'>
        <CardHeader className='space-y-3 px-6 pt-6'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-9 w-40' />
        </CardHeader>
        <CardContent className='space-y-4 px-6 pb-6'>
          <Skeleton className='h-16 w-full rounded-xl' />
          <Skeleton className='h-16 w-full rounded-xl' />
          <Skeleton className='h-16 w-full rounded-xl' />
        </CardContent>
      </Card>
    </div>
  )
}

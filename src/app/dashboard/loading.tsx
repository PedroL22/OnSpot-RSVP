import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-5 border-border border-b pb-6 md:flex-row md:items-end md:justify-between'>
        <div className='space-y-3'>
          <Skeleton className='h-3 w-36' />
          <div className='space-y-2'>
            <Skeleton className='h-12 w-72 max-w-full' />
            <Skeleton className='h-12 w-52 max-w-[70%]' />
          </div>
        </div>
        <Skeleton className='h-11 w-36 rounded-md' />
      </div>

      <div className='space-y-3'>
        <Skeleton className='h-3 w-24' />

        <div className='space-y-3'>
          {Array.from({ length: 3 }, (_, index) => `dashboard-loading-${index}`).map((cardId, index) => (
            <Card
              className='overflow-hidden border-border/80 bg-card/95 py-0 shadow-(--shadow-sm)'
              key={cardId}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className='h-1 w-full bg-primary/80' />

              <CardContent className='p-5 pt-2.5'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6'>
                  <div className='flex shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-muted/60 px-4 py-3 text-center sm:w-20'>
                    <Skeleton className='mb-2 h-3 w-10' />
                    <Skeleton className='h-10 w-12' />
                  </div>

                  <div className='min-w-0 flex-1 space-y-3'>
                    <Skeleton className='h-9 w-64 max-w-full' />

                    <div className='flex flex-wrap items-center gap-3'>
                      <Skeleton className='h-3 w-24' />
                      <div className='h-3 w-px bg-border-strong' />
                      <Skeleton className='h-3 w-28' />
                    </div>

                    <Skeleton className='h-2 w-full max-w-xs' />
                  </div>

                  <div className='grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-3'>
                    <Skeleton className='h-20 w-24 rounded-2xl' />
                    <Skeleton className='h-20 w-24 rounded-2xl' />
                    <Skeleton className='hidden h-20 w-24 rounded-2xl lg:block' />
                  </div>

                  <div className='flex shrink-0 items-center gap-2'>
                    <Skeleton className='size-10 rounded-md' />
                    <Skeleton className='h-10 w-28 rounded-md' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

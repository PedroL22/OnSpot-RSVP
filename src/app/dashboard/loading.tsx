import { LoadingCardSkeleton } from '~/components/feedback/loading-card-skeleton'
import { Skeleton } from '~/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className='space-y-8'>
      <div className='flex items-end justify-between border-border border-b pb-6'>
        <div className='space-y-3'>
          <Skeleton className='h-3 w-32' />
          <Skeleton className='h-12 w-56' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>

      <Skeleton className='h-3 w-24' />

      <LoadingCardSkeleton count={3} />
    </div>
  )
}

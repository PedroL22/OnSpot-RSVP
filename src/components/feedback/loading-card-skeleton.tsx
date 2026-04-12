import { Skeleton } from '~/components/ui/skeleton'

type LoadingCardSkeletonProps = {
  count?: number
}

export const LoadingCardSkeleton = ({ count = 3 }: LoadingCardSkeletonProps) => {
  const skeletonIds = Array.from({ length: count }, (_, index) => `loading-card-${count}-${index}`)

  return (
    <div className='space-y-4'>
      {skeletonIds.map((skeletonId) => (
        <div className='rounded-2xl border border-border bg-card p-5 shadow-(--shadow-sm)' key={skeletonId}>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Skeleton className='size-16 rounded-2xl' />

            <div className='flex-1 space-y-3'>
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-3 w-64' />
              <Skeleton className='h-2 w-full max-w-56' />
            </div>

            <div className='grid grid-cols-3 gap-3 sm:w-52'>
              <Skeleton className='h-12 rounded-xl' />
              <Skeleton className='h-12 rounded-xl' />
              <Skeleton className='h-12 rounded-xl' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

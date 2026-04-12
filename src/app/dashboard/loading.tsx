export default function DashboardLoading() {
  return (
    <div className='animate-pulse space-y-8'>
      {/* Header skeleton */}
      <div className='flex items-end justify-between border-b border-border pb-6'>
        <div className='space-y-3'>
          <div className='h-2.5 w-32 rounded bg-void-surface' />
          <div className='h-10 w-48 rounded bg-void-surface' />
        </div>
        <div className='h-9 w-28 rounded bg-void-surface' />
      </div>

      {/* Label skeleton */}
      <div className='h-2.5 w-20 rounded bg-void-surface' />

      {/* Event row skeletons */}
      <div className='space-y-3'>
        {[1, 2, 3].map((i) => (
          <div className='h-24 rounded border border-border bg-void-raised' key={i} />
        ))}
      </div>
    </div>
  )
}

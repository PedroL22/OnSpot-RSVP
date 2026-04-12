export default function DashboardLoading() {
  return (
    <div className='animate-pulse space-y-8'>
      {/* Hero skeleton */}
      <div className='h-64 rounded-2xl bg-ink/5' />

      {/* Cards grid skeleton */}
      <div className='grid gap-4 lg:grid-cols-2'>
        {[1, 2, 3, 4].map((i) => (
          <div className='h-56 rounded-xl border border-border bg-surface-elevated' key={i} />
        ))}
      </div>
    </div>
  )
}

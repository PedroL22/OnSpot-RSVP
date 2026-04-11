export default function DashboardLoading() {
  const skeletonKeys = ['summary-1', 'summary-2', 'summary-3', 'summary-4']

  return (
    <div className='grid gap-5 xl:grid-cols-2'>
      {skeletonKeys.map((key) => (
        <div
          className='h-64 rounded-[2rem] border border-black/5 bg-white/70 shadow-[0_24px_70px_rgba(15,23,42,0.08)]'
          key={key}
        />
      ))}
    </div>
  )
}

import { MetricCard } from '~/components/data/metric-card'

type EventStatsGridProps = {
  checkedInCount: number
  confirmedCount: number
  remainingCapacity: number | null
  waitlistedCount: number
}

export const EventStatsGrid = ({
  checkedInCount,
  confirmedCount,
  remainingCapacity,
  waitlistedCount,
}: EventStatsGridProps) => {
  return (
    <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
      <MetricCard label='Confirmed' value={confirmedCount} />
      <MetricCard label='Checked in' tone='primary' value={checkedInCount} />
      <MetricCard label='Waitlisted' tone='warning' value={waitlistedCount} />
      <MetricCard label='Remaining' value={remainingCapacity === null ? '∞' : remainingCapacity} />
    </div>
  )
}

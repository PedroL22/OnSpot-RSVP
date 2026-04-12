type DashboardUserChipProps = {
  name: string
}

export const DashboardUserChip = ({ name }: DashboardUserChipProps) => {
  return (
    <div className='hidden items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 sm:flex'>
      <span className='block size-1.5 rounded-full bg-success' />
      <span className='font-mono text-[11px] text-muted-foreground'>{name}</span>
    </div>
  )
}

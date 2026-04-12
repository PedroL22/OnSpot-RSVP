import Link from 'next/link'

import { Plus } from '@phosphor-icons/react/dist/ssr'

import { PageHeader } from '~/components/layout/page-header'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export const DashboardPageHeader = () => {
  return (
    <PageHeader
      action={
        <Link
          className={cn(buttonVariants({ size: 'lg' }), 'gap-2 font-mono text-[11px] uppercase tracking-[0.16em]')}
          href='/dashboard/events/new'
        >
          <Plus data-icon='inline-start' />
          New event
        </Link>
      }
      eyebrow='Organizer dashboard'
      title={
        <>
          Your <span className='text-primary'>events</span>
        </>
      }
    />
  )
}

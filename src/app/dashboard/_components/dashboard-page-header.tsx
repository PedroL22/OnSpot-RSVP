import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { PageHeader } from '~/components/layout/page-header'
import { AppLink } from '~/components/navigation/app-link'
import { buttonVariants } from '~/components/ui/button'

import { cn } from '~/lib/utils'

export const DashboardPageHeader = () => {
  return (
    <PageHeader
      action={
        <AppLink
          className={cn(buttonVariants({ size: 'lg' }), 'gap-2 font-mono text-[11px] uppercase tracking-[0.16em]')}
          href='/dashboard/events/new'
        >
          <PlusIcon data-icon='inline-start' />
          New event
        </AppLink>
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

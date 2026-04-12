import { BrandMark } from '~/components/brand/brand-mark'
import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { DashboardNav } from './dashboard-nav'
import { DashboardUserChip } from './dashboard-user-chip'

type DashboardHeaderProps = {
  onSignOut: (formData: FormData) => void | Promise<void>
  userName: string
}

export const DashboardHeader = ({ onSignOut, userName }: DashboardHeaderProps) => {
  return (
    <header className='sticky top-0 z-40 border-border border-b bg-background/90 backdrop-blur-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-10'>
        <div className='flex items-center gap-4 md:gap-6'>
          <BrandMark href='/dashboard' />
          <div className='hidden h-4 w-px bg-border-strong md:block' />
          <DashboardNav />
        </div>

        <div className='flex items-center gap-3'>
          <ThemeToggle />
          <DashboardUserChip name={userName} />

          <form action={onSignOut}>
            <Button className='font-mono text-[11px] uppercase tracking-[0.16em]' type='submit' variant='ghost'>
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}

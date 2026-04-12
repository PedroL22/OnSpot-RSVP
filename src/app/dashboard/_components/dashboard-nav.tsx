import { ListIcon } from '@phosphor-icons/react/dist/ssr'
import { AppLink } from '~/components/navigation/app-link'
import { Button, buttonVariants } from '~/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'

import { cn } from '~/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Events' },
  { href: '/dashboard/events/new', label: 'New event' },
]

export const DashboardNav = () => {
  return (
    <>
      <nav className='hidden items-center gap-1 md:flex'>
        {navItems.map((item) => (
          <AppLink
            className={cn(
              buttonVariants({ size: 'sm', variant: 'ghost' }),
              'font-mono text-[11px] text-muted-foreground uppercase tracking-[0.16em]'
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </AppLink>
        ))}
      </nav>

      <div className='md:hidden'>
        <Sheet>
          <SheetTrigger render={<Button size='icon-sm' variant='ghost' />}>
            <ListIcon />
            <span className='sr-only'>Open navigation</span>
          </SheetTrigger>

          <SheetContent className='border-border border-l bg-popover' side='right'>
            <SheetHeader>
              <SheetTitle className='font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]'>
                Navigation
              </SheetTitle>
            </SheetHeader>

            <div className='flex flex-col gap-2 px-4 pb-4'>
              {navItems.map((item) => (
                <AppLink
                  className={cn(buttonVariants({ variant: 'outline' }), 'justify-start')}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </AppLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

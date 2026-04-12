import { PatternBackground } from '~/components/layout/pattern-background'
import { AppLink } from '~/components/navigation/app-link'
import { RoutePrefetch } from '~/components/navigation/route-prefetch'
import { buttonVariants } from '~/components/ui/button'
import { AuthCalloutCard } from './_components/auth-callout-card'
import { LandingHeader } from './_components/landing-header'
import { LandingHero } from './_components/landing-hero'
import { SiteFooter } from './_components/site-footer'

import { signOut } from '~/app/(auth)/actions'
import { cn } from '~/lib/utils'
import { getSession } from '~/server/better-auth/server'

export default async function Home() {
  const session = await getSession()
  const prefetchHrefs = session?.user ? ['/dashboard'] : ['/sign-in', '/sign-up']

  return (
    <main className='relative min-h-screen overflow-hidden'>
      <RoutePrefetch hrefs={prefetchHrefs} />
      <PatternBackground className='opacity-70' />
      <div className='pointer-events-none fixed top-0 right-0 size-128 bg-[radial-gradient(circle_at_80%_20%,rgba(0,166,244,0.10),transparent_60%)]' />

      <div className='relative mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10'>
        <LandingHeader
          actions={
            session?.user ? (
              <div className='flex items-center gap-3'>
                <span className='hidden font-mono text-muted-foreground text-xs sm:inline'>{session.user.email}</span>

                <form action={signOut}>
                  <button
                    className={cn(
                      buttonVariants({ size: 'sm', variant: 'ghost' }),
                      'font-mono text-[11px] uppercase tracking-[0.16em]'
                    )}
                    type='submit'
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <nav className='flex items-center gap-2'>
                <AppLink
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'ghost' }),
                    'font-mono text-[11px] uppercase tracking-[0.16em]'
                  )}
                  href='/sign-in'
                >
                  Sign in
                </AppLink>

                <AppLink
                  className={cn(buttonVariants({ size: 'sm' }), 'font-mono text-[11px] uppercase tracking-[0.16em]')}
                  href='/sign-up'
                >
                  Get started
                </AppLink>
              </nav>
            )
          }
        />

        <LandingHero
          aside={
            <AuthCalloutCard
              body={
                session?.user ? (
                  <>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      Your event dashboard is ready. Manage RSVPs, handle waitlists, and run check-in from one place.
                    </p>

                    <AppLink
                      className={cn(
                        buttonVariants({ size: 'lg' }),
                        'w-full font-mono text-[11px] uppercase tracking-[0.16em]'
                      )}
                      href='/dashboard'
                    >
                      Open dashboard
                    </AppLink>

                    <form action={signOut}>
                      <button
                        className={cn(
                          buttonVariants({ size: 'lg', variant: 'outline' }),
                          'w-full font-mono text-[11px] uppercase tracking-[0.16em]'
                        )}
                        type='submit'
                      >
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      Sign up with email or connect via GitHub. Your first event is one form away.
                    </p>

                    <AppLink
                      className={cn(
                        buttonVariants({ size: 'lg' }),
                        'w-full font-mono text-[11px] uppercase tracking-[0.16em]'
                      )}
                      href='/sign-up'
                    >
                      Create an account
                    </AppLink>

                    <AppLink
                      className={cn(
                        buttonVariants({ size: 'lg', variant: 'outline' }),
                        'w-full font-mono text-[11px] uppercase tracking-[0.16em]'
                      )}
                      href='/sign-in'
                    >
                      Sign in to continue
                    </AppLink>

                    <p className='border-border border-t pt-5 text-center font-mono text-[10px] text-dim-foreground uppercase tracking-[0.18em]'>
                      No credit card required. Free for personal events.
                    </p>
                  </>
                )
              }
              intro={session?.user ? 'Session active' : 'Get started'}
              title={
                session?.user ? (
                  <>
                    Welcome back,
                    <br />
                    <span className='text-primary'>{session.user.name}</span>
                  </>
                ) : (
                  <>
                    Create your
                    <br />
                    <span className='text-primary'>organizer</span> account
                  </>
                )
              }
            />
          }
        />

        <SiteFooter />
      </div>
    </main>
  )
}

import '~/styles/globals.css'

import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: ['400'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  style: ['normal'],
})

export const metadata: Metadata = {
  title: 'OnSpot RSVP',
  description: 'The sharpest event check-in system you will ever deploy.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      className={cn(dmSans.variable, bebasNeue.variable, jetbrainsMono.variable)}
      lang='en'
      suppressHydrationWarning
    >
      <body className='antialiased'>
        <ThemeProvider attribute='class' defaultTheme='system' disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

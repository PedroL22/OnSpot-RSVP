import '~/styles/globals.css'

import type { Metadata } from 'next'
import { Instrument_Serif, Sora } from 'next/font/google'
import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: ['400'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'OnSpot RSVP',
  description: 'The elegant event check-in system for modern organizers.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={cn(sora.variable, instrumentSerif.variable)} lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  )
}

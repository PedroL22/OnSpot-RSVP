import '~/styles/globals.css'

import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'OnSpot RSVP',
  description: 'A simple RSVP app built with Next.js and Tailwind CSS.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={cn(dmSans.variable, 'font-sans')} lang='en'>
      <body>{children}</body>
    </html>
  )
}

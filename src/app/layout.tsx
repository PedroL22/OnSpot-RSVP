import '~/styles/globals.css'

import type { Metadata } from 'next'
import { DM_Sans, Geist } from 'next/font/google'
import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'OnSpot RSVP',
  description: 'A simple RSVP app built with Next.js and Tailwind CSS.',
}

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={cn(geist.variable, 'font-sans', dmSans.variable)} lang='en'>
      <body>{children}</body>
    </html>
  )
}

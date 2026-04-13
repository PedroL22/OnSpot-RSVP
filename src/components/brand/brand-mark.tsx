import Image from 'next/image'
import Link from 'next/link'

import { cn } from '~/lib/utils'

type BrandMarkProps = {
  className?: string
  href?: string
  logoClassName?: string
  textClassName?: string
}

export const BrandMark = ({ className, href = '/', logoClassName, textClassName }: BrandMarkProps) => {
  return (
    <Link className={cn('group inline-flex items-center gap-3', className)} href={href}>
      <Image
        alt='OnSpot RSVP'
        className={cn('size-8 transition-opacity group-hover:opacity-80', logoClassName)}
        height={32}
        priority
        src='/logo.svg'
        width={32}
      />
      <span
        className={cn('font-medium font-mono text-[11px] text-foreground uppercase tracking-[0.24em]', textClassName)}
      >
        OnSpot
      </span>
    </Link>
  )
}

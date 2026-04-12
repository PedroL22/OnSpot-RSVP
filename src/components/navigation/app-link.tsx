import Link from 'next/link'
import type { ComponentProps } from 'react'

type AppLinkProps = ComponentProps<typeof Link>

const isInternalHref = (href: AppLinkProps['href']) => {
  return typeof href === 'string' ? href.startsWith('/') : true
}

export const AppLink = ({ href, prefetch, ...props }: AppLinkProps) => {
  return <Link href={href} prefetch={prefetch ?? isInternalHref(href)} {...props} />
}

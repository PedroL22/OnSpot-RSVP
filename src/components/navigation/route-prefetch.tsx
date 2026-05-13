'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type RoutePrefetchProps = {
  hrefs: readonly string[]
}

export const RoutePrefetch = ({ hrefs }: RoutePrefetchProps) => {
  const { prefetch } = useRouter()

  useEffect(() => {
    for (const href of new Set(hrefs.filter(Boolean))) {
      prefetch(href)
    }
  }, [hrefs, prefetch])

  return null
}

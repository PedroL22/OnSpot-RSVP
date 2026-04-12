'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type RoutePrefetchProps = {
  hrefs: readonly string[]
}

export const RoutePrefetch = ({ hrefs }: RoutePrefetchProps) => {
  const router = useRouter()

  useEffect(() => {
    for (const href of new Set(hrefs.filter(Boolean))) {
      router.prefetch(href)
    }
  }, [hrefs, router])

  return null
}

const defaultBaseUrl = 'https://onspot.local'

const normalizeInternalPath = (value: string) => {
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return null
  }

  const parsed = new URL(value, defaultBaseUrl)

  if (parsed.origin !== defaultBaseUrl) {
    return null
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`
}

export const sanitizeCallbackURL = (value: string | null | undefined, fallback = '/dashboard') => {
  const normalizedFallback = normalizeInternalPath(fallback) ?? '/dashboard'

  if (typeof value !== 'string') {
    return normalizedFallback
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return normalizedFallback
  }

  return normalizeInternalPath(trimmedValue) ?? normalizedFallback
}

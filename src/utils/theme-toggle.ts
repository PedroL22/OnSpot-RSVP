type ThemePreference = string | null | undefined
type ResolvedTheme = string | null | undefined
type SetTheme = (theme: 'dark' | 'light' | 'system') => void

export const getNextTheme = (theme: ThemePreference, resolvedTheme: ResolvedTheme) => {
  if (theme === 'system' || !theme) {
    return resolvedTheme === 'dark' ? 'light' : 'dark'
  }

  return 'system'
}

export const toggleTheme = ({
  theme,
  resolvedTheme,
  setTheme,
}: {
  theme: ThemePreference
  resolvedTheme: ResolvedTheme
  setTheme: SetTheme
}) => {
  const nextTheme = getNextTheme(theme, resolvedTheme)
  setTheme(nextTheme)
}

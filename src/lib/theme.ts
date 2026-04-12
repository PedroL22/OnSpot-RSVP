export type ResolvedTheme = 'light' | 'dark'

export const resolveInitialTheme = (storedTheme: string | null | undefined, prefersDark: boolean): ResolvedTheme => {
  if (storedTheme === 'dark') return 'dark'
  if (storedTheme === 'light') return 'light'

  return prefersDark ? 'dark' : 'light'
}

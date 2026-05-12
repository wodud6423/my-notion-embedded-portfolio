'use client'

import * as React from "react"
import type { Theme } from "@/types"
import { THEME_STORAGE_KEY } from "@/lib/constants"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  mounted: boolean
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme()
  return theme
}

const VALID_THEMES = ['light', 'dark', 'system'] as const

// 로컬스토리지에서 저장된 테마를 읽어 초기값으로 사용 (지연 초기화)
function getInitialTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === 'undefined') return defaultTheme
  const stored = localStorage.getItem(storageKey)
  if (stored && (VALID_THEMES as readonly string[]).includes(stored)) {
    return stored as Theme
  }
  return defaultTheme
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  // 지연 초기화로 localStorage 값을 초기 상태로 직접 사용
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getInitialTheme(storageKey, defaultTheme)
  )
  // mounted는 렌더링에 영향을 주지 않는 hydration 마커이므로 ref 사용
  const mountedRef = React.useRef(false)
  const [mounted, setMounted] = React.useState(false)

  // DOM 클래스 업데이트 (외부 시스템 동기화) + 마운트 상태 초기화
  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      setMounted(true)
    }
    const resolved = resolveTheme(theme)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [theme])

  // 시스템 테마 변경 감지 (외부 이벤트 구독)
  React.useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      document.documentElement.classList.toggle('dark', mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  const setTheme = React.useCallback((newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
  }, [storageKey])

  const resolvedTheme = resolveTheme(theme)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme는 ThemeProvider 내부에서 사용해야 합니다.')
  }
  return context
}

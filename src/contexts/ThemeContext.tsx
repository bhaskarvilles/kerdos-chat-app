import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface ThemeContextType {
  theme: string
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    rootRef.current = document.documentElement
  }, [])

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.classList.remove('light', 'dark')
      rootRef.current.classList.add(theme)
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }, [setTheme])

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
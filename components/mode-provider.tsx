'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type SphereMode = 'web3' | 'ai'

const STORAGE_KEY = 'web3sphere:mode'

type ModeContextValue = {
  mode: SphereMode
  setMode: (mode: SphereMode) => void
  toggleMode: () => void
  /** true once the persisted preference has been read on the client */
  ready: boolean
}

const ModeContext = createContext<ModeContextValue | null>(null)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<SphereMode>('web3')
  const [ready, setReady] = useState(false)

  // Restore the saved track on mount so the choice persists for future visits.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'web3' || saved === 'ai') {
        setModeState(saved)
      }
    } catch {
      // ignore storage access errors (e.g. private mode)
    }
    setReady(true)
  }, [])

  const setMode = useCallback((next: SphereMode) => {
    setModeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'web3' ? 'ai' : 'web3'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ mode, setMode, toggleMode, ready }),
    [mode, setMode, toggleMode, ready],
  )

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return ctx
}

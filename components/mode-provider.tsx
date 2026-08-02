'use client'

/**
 * Mode Provider (simplified — permanently locked to Web3 track)
 * ─────────────────────────────────────────────────────────────────────────────
 * The AI / Web3 toggle has been removed from the header. The default track is
 * Web3 and there is no user-facing switch. Keep the provider in place so all
 * components that import `useMode()` continue to work without refactor churn.
 * They will always receive `mode === 'web3'`.
 */

import { createContext, useCallback, useContext, useMemo } from 'react'

export type SphereMode = 'web3' | 'ai'

type ModeContextValue = {
  mode: SphereMode
  setMode: (mode: SphereMode) => void
  toggleMode: () => void
  ready: boolean
}

const ModeContext = createContext<ModeContextValue | null>(null)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  /** Always Web3. No localStorage, no state toggles. */
  const mode: SphereMode = 'web3'
  const ready = true

  const setMode = useCallback((_next: SphereMode) => {
    /** no-op: track is permanently web3 */
  }, [])

  const toggleMode = useCallback(() => {
    /** no-op: track is permanently web3 */
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

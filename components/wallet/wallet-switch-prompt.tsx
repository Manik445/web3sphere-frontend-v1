'use client'

/**
 * Wallet Switch Prompt
 * ─────────────────────────────────────────────────────────────────────────────
 * Shown when the connected wallet address changes mid-session.
 * Prevents silent account switching.
 */

import { useWalletState, useWalletDispatch } from '@/context/wallet-context'
import { clearAllAuth } from '@/lib/wallet/token-manager'
import { useDisconnect } from '@reown/appkit/react'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatAddress } from '@/lib/wallet/wallet-service'

export function WalletSwitchPrompt() {
  const { showSwitchPrompt, connectedWallet, authenticatedAddress } = useWalletState()
  const dispatch = useWalletDispatch()
  const { disconnect } = useDisconnect()

  if (!showSwitchPrompt) return null

  function handleKeepSession() {
    dispatch({ type: 'SET_SWITCH_PROMPT', show: false })
  }

  function handleReauth() {
    // Clear current auth and redirect to login
    clearAllAuth()
    dispatch({ type: 'RESET' })
    window.location.href = '/login'
  }

  function handleDisconnect() {
    disconnect()
    dispatch({ type: 'SET_SWITCH_PROMPT', show: false })
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleKeepSession} />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={handleKeepSession}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30">
          <AlertTriangle className="h-6 w-6 text-amber-400" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-foreground">Wallet Changed</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The connected wallet differs from your authenticated wallet.
        </p>

        {/* Address comparison */}
        <div className="mt-4 space-y-2 rounded-xl border border-border bg-secondary/30 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">AUTHENTICATED</span>
            <span className="font-mono text-foreground">
              {authenticatedAddress ? formatAddress(authenticatedAddress) : '—'}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-mono">CONNECTED NOW</span>
            <span className="font-mono text-amber-400">
              {connectedWallet ? formatAddress(connectedWallet.address) : '—'}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button
            id="wallet-switch-reauth-btn"
            onClick={handleReauth}
            className="w-full gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Authenticate with New Wallet
          </Button>
          <Button
            id="wallet-switch-keep-btn"
            variant="outline"
            onClick={handleKeepSession}
            className="w-full"
          >
            Keep Current Session
          </Button>
        </div>
      </div>
    </div>
  )
}

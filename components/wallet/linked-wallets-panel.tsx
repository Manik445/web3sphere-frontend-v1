'use client'

/**
 * Linked Wallets Panel
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays and manages all wallets linked to the authenticated user's account.
 * Used in the profile/settings page.
 */

import { useState, useEffect, useCallback } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { Wallet, Star, Trash2, Plus, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { authApi, type LinkedWallet } from '@/lib/api/auth'
import { getAccessToken } from '@/lib/wallet/token-manager'
import { formatAddress } from '@/lib/wallet/wallet-service'
import { getChainById } from '@/config/wallets'
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button'
import { cn } from '@/lib/utils'

export function LinkedWalletsPanel() {
  const { isConnected } = useAppKitAccount()
  const [wallets, setWallets] = useState<LinkedWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showLinkFlow, setShowLinkFlow] = useState(false)

  const fetchWallets = useCallback(async () => {
    const token = getAccessToken()
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await authApi.getWallets(token)
      if (res.success && res.data) {
        setWallets(res.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load wallets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  async function handleSetPrimary(walletId: string) {
    const token = getAccessToken()
    if (!token) return
    setActionLoading(walletId)
    setError(null)
    try {
      await authApi.setPrimaryWallet(walletId, token)
      setSuccess('Primary wallet updated')
      await fetchWallets()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update primary wallet')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleUnlink(walletId: string) {
    const token = getAccessToken()
    if (!token) return
    if (!confirm('Are you sure you want to remove this wallet?')) return
    setActionLoading(walletId)
    setError(null)
    try {
      await authApi.unlinkWallet(walletId, token)
      setSuccess('Wallet removed')
      await fetchWallets()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to remove wallet')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-secondary/50">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Linked Wallets</h3>
            <p className="text-xs text-muted-foreground">Manage your connected wallets</p>
          </div>
        </div>

        {!showLinkFlow && (
          <button
            onClick={() => setShowLinkFlow(true)}
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Link Wallet
          </button>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-400">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          {success}
        </div>
      )}

      {/* Link Flow */}
      {showLinkFlow && (
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Link a new wallet</p>
            <button
              onClick={() => setShowLinkFlow(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <WalletConnectButton
            linkMode
            accessToken={getAccessToken() || ''}
            onSuccess={() => {
              setShowLinkFlow(false)
              fetchWallets()
            }}
            className="w-full"
          />
        </div>
      )}

      {/* Wallet List */}
      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : wallets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <ShieldCheck className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No wallets linked yet</p>
            <p className="text-xs text-muted-foreground/70">Connect a wallet to link it to your account</p>
          </div>
        ) : (
          wallets.map((wallet) => {
            const chain = getChainById(wallet.chain_id)
            const isActionTarget = actionLoading === wallet.id

            return (
              <div
                key={wallet.id}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-3 transition-colors',
                  wallet.is_primary
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-secondary/20 hover:bg-secondary/40'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/60 text-lg">
                    {chain?.icon || '⬡'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-mono text-sm text-foreground">
                        {formatAddress(wallet.address)}
                      </p>
                      {wallet.is_primary && (
                        <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-mono text-primary">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {wallet.wallet_provider} · {chain?.name || `Chain ${wallet.chain_id}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {!wallet.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(wallet.id)}
                      disabled={!!actionLoading}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                      title="Set as primary"
                    >
                      {isActionTarget ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Star className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleUnlink(wallet.id)}
                    disabled={!!actionLoading || wallet.is_primary}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
                    title={wallet.is_primary ? 'Cannot remove primary wallet' : 'Remove wallet'}
                  >
                    {isActionTarget ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

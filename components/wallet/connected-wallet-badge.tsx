'use client'

/**
 * Connected Wallet Badge
 * ─────────────────────────────────────────────────────────────────────────────
 * Displayed in the header when a wallet is authenticated.
 * Unified across EVM and Solana via AppKit + WalletConnect.
 */

import { useState, useRef, useEffect } from 'react'
import { useAppKit, useAppKitAccount, useDisconnect, useAppKitNetwork } from '@reown/appkit/react'
import { useChainId } from 'wagmi'
import { Copy, ExternalLink, ChevronDown, LogOut, Link2, Wifi } from 'lucide-react'
import { formatAddress, copyToClipboard, getExplorerUrl } from '@/lib/wallet/wallet-service'
import { useWalletState } from '@/context/wallet-context'
import { cn } from '@/lib/utils'

interface ConnectedWalletBadgeProps {
  className?: string
}

function resolveChainIdForExplorer(
  caipAddress: string | undefined,
  caipNetworkId: string | undefined,
  wagmiChainId: number | undefined
): string | number {
  if (caipAddress) {
    const [ns, ref] = caipAddress.split(':')
    if (ns === 'solana') {
      return caipNetworkId || 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
    }
    if (ns === 'eip155' && ref) {
      const n = parseInt(ref, 10)
      if (!isNaN(n)) return n
    }
  }
  return wagmiChainId || 1
}

export function ConnectedWalletBadge({ className }: ConnectedWalletBadgeProps) {
  const { address, isConnected, caipAddress } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const wagmiChainId = useChainId()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()
  const { chainUnsupported } = useWalletState()

  const [open2, setOpen2] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (open2 && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen2(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open2])

  if (!isConnected || !address) return null

  const short = formatAddress(address)
  const effectiveChainId = resolveChainIdForExplorer(caipAddress, caipNetwork?.caipNetworkId, wagmiChainId)
  const explorerUrl = getExplorerUrl(address, effectiveChainId)

  async function handleCopy() {
    await copyToClipboard(address!)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        id="wallet-badge-btn"
        onClick={() => setOpen2(!open2)}
        className={cn(
          'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all',
          'bg-secondary/50 hover:bg-secondary border-border hover:border-primary/40',
          chainUnsupported && 'border-amber-500/50 bg-amber-500/10'
        )}
      >
        {/* Status dot */}
        <span className={cn(
          'relative flex h-2 w-2 items-center justify-center',
        )}>
          <span className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-50',
            chainUnsupported ? 'bg-amber-400' : 'bg-green-400'
          )} />
          <span className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            chainUnsupported ? 'bg-amber-500' : 'bg-green-500'
          )} />
        </span>

        <Wifi className="h-3.5 w-3.5 text-muted-foreground" />

        <span className="font-mono">{short}</span>

        {chainUnsupported && (
          <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono text-amber-400">
            Wrong Network
          </span>
        )}

        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', open2 && 'rotate-180')} />
      </button>

      {open2 && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-border bg-card p-1 shadow-2xl">
          {/* Address display */}
          <div className="px-3 py-2.5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Connected Wallet</p>
            <p className="mt-0.5 font-mono text-sm text-foreground">{short}</p>
            {chainUnsupported && (
              <p className="mt-1 text-[10px] text-amber-400">⚠ Switch to a supported network</p>
            )}
          </div>

          <div className="my-1 h-px bg-border" />

          {/* Actions */}
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy Address'}
          </button>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen2(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on Explorer
          </a>

          <button
            onClick={() => { open(); setOpen2(false) }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Link2 className="h-3.5 w-3.5" />
            Switch Wallet
          </button>

          <div className="my-1 h-px bg-border" />

          <button
            onClick={() => { disconnect(); setOpen2(false) }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  )
}

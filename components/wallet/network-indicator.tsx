'use client'

/**
 * Network Indicator
 * ─────────────────────────────────────────────────────────────────────────────
 * Shows current chain status in header/wallet area.
 * Unified across EVM and Solana via AppKit CAIP-2 network detection.
 */

import { useChainId } from 'wagmi'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { AlertTriangle } from 'lucide-react'
import { getChainById } from '@/config/wallets'
import { useWalletState } from '@/context/wallet-context'
import { cn } from '@/lib/utils'

function resolveChainId(
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

export function NetworkIndicator({ className }: { className?: string }) {
  const { isConnected, caipAddress } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const wagmiChainId = useChainId()
  const { chainUnsupported } = useWalletState()

  if (!isConnected) return null

  const chainId = resolveChainId(caipAddress, caipNetwork?.caipNetworkId, wagmiChainId)
  const chain = getChainById(chainId)

  if (chainUnsupported || !chain) {
    return (
      <div className={cn(
        'flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-mono text-amber-400',
        className
      )}>
        <AlertTriangle className="h-3 w-3" />
        <span>Unsupported Network</span>
      </div>
    )
  }

  return (
    <div className={cn(
      'flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-mono text-green-400',
      className
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
      <span>{chain.name}</span>
    </div>
  )
}

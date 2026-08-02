'use client'

/**
 * Wallet Provider
 * ─────────────────────────────────────────────────────────────────────────────
 * Unified wallet provider built entirely around Reown AppKit + WalletConnect.
 * Handles both EVM and Solana wallet connectivity through a single integration.
 * The Go backend owns challenge generation, signature verification, JWT issuance,
 * refresh token rotation, and session management.
 *
 * Composition:
 *   1. WagmiProvider (EVM via AppKit wagmi adapter)
 *   2. QueryClientProvider (required by wagmi v3+)
 *   3. WalletContextProvider (application-level auth state)
 *   4. WalletEventListener (syncs wallet state → app state)
 */

import { useEffect, type ReactNode } from 'react'
import { WagmiProvider, useAccount, useChainId } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { WalletContextProvider, useWalletDispatch, useWalletState } from '@/context/wallet-context'
import { isChainSupported, getChainType } from '@/config/wallets'
import { isAuthenticated, getWalletInfo } from '@/lib/wallet/token-manager'
import { requiresReauth } from '@/lib/wallet/session-manager'
import { initAppKit, wagmiAdapter } from '@/lib/wallet/appkit-config'

initAppKit()

const queryClient = new QueryClient()

function resolveChainAndType(
  caipAddress: string | undefined,
  wagmiChainId: number | undefined,
  caipNetwork: { caipNetworkId?: string } | undefined
): { chainId: string | number; type: 'evm' | 'solana'; provider: string } {
  if (caipAddress) {
    const [namespace, reference] = caipAddress.split(':')
    if (namespace === 'solana') {
      const solanaChainId = caipNetwork?.caipNetworkId || 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
      return { chainId: solanaChainId, type: 'solana', provider: 'solana' }
    }
    if (namespace === 'eip155' && reference) {
      const numeric = parseInt(reference, 10)
      if (!isNaN(numeric)) {
        return { chainId: numeric, type: 'evm', provider: 'evm' }
      }
    }
  }
  return { chainId: wagmiChainId || 1, type: 'evm', provider: 'evm' }
}

function WalletEventListener() {
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()
  const wagmiChainId = useChainId()
  const { address: appKitAddress, isConnected: appKitConnected, caipAddress } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const dispatch = useWalletDispatch()
  const state = useWalletState()

  const activeAddress = appKitAddress || wagmiAddress
  const activeConnected = appKitConnected || wagmiConnected

  useEffect(() => {
    if (activeConnected && activeAddress) {
      const { chainId, type, provider } = resolveChainAndType(caipAddress, wagmiChainId, caipNetwork)
      dispatch({
        type: 'SET_CONNECTED_WALLET',
        wallet: {
          address: activeAddress,
          chainId,
          provider,
          type,
        },
      })
    } else if (!activeConnected) {
      dispatch({ type: 'SET_CONNECTED_WALLET', wallet: null })
    }
  }, [activeAddress, activeConnected, caipAddress, wagmiChainId, caipNetwork, dispatch])

  useEffect(() => {
    if (!activeAddress || !state.isAuthenticated) return
    if (requiresReauth(activeAddress, state.authenticatedAddress)) {
      dispatch({ type: 'SET_SWITCH_PROMPT', show: true })
    }
  }, [activeAddress, state.authenticatedAddress, state.isAuthenticated, dispatch])

  useEffect(() => {
    if (!activeConnected) {
      dispatch({ type: 'SET_CHAIN_UNSUPPORTED', unsupported: false })
      return
    }
    const { chainId } = resolveChainAndType(caipAddress, wagmiChainId, caipNetwork)
    dispatch({ type: 'SET_CHAIN_UNSUPPORTED', unsupported: !isChainSupported(chainId) })
  }, [activeConnected, caipAddress, wagmiChainId, caipNetwork, dispatch])

  useEffect(() => {
    if (isAuthenticated()) {
      const info = getWalletInfo()
      if (info?.address) {
        dispatch({ type: 'SET_AUTHENTICATED', address: info.address })
      }
    }
  }, [dispatch])

  return null
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as any}>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          <WalletEventListener />
          {children}
        </WalletContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

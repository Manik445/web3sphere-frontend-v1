'use client'

/**
 * Wallet Connect Button
 * ─────────────────────────────────────────────────────────────────────────────
 * Primary entry point for wallet connection + authentication.
 * Single modal from Reown AppKit + WalletConnect for BOTH EVM and Solana.
 *
 * Flow (runs once per connect session; never auto-retries):
 *   1. User clicks → AppKit modal opens
 *   2. User picks ANY wallet (EVM or Solana — all via WalletConnect)
 *   3. Once connected, auto-run challenge → sign (EVM:wagmi / Solana:window adapter)
 *   4. Submit signed challenge to Go backend → receive JWT + refresh token
 *   5. Tokens stored, dispatch SET_AUTHENTICATED, redirect
 *
 * Rate-limit / infinite-loop safeguards:
 *   - Auth auto-trigger only fires once per (address + chainId) session key
 *   - On error, auto-trigger is NOT re-enabled; user must click to retry
 *   - If JWT already exists locally, auto-trigger is skipped entirely
 *   - useRef guard ensures deduplication across renders / remounts
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { Loader2, Wallet, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { runWalletAuthFlow } from '@/components/wallet/wallet-auth-flow'
import { useWalletDispatch } from '@/context/wallet-context'
import { isAuthenticated } from '@/lib/wallet/token-manager'
import { cn } from '@/lib/utils'

type AuthStep =
  | 'idle'
  | 'connecting'
  | 'challenging'
  | 'signing'
  | 'verifying'
  | 'done'
  | 'error'

const STEP_LABELS: Record<AuthStep, string> = {
  idle: 'Connect Wallet',
  connecting: 'Connecting…',
  challenging: 'Requesting challenge…',
  signing: 'Sign message in wallet…',
  verifying: 'Verifying…',
  done: 'Authenticated!',
  error: 'Try again',
}

interface WalletConnectButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  onSuccess?: () => void
  linkMode?: boolean
  accessToken?: string
}

interface ResolvedChain {
  chainId: string | number
  chainType: 'evm' | 'solana'
  provider: string
}

function resolveChainFromCaip(caipAddress: string | undefined, caipNetworkId?: string): ResolvedChain {
  if (caipAddress) {
    const [namespace, reference] = caipAddress.split(':')
    if (namespace === 'solana') {
      const chainId = caipNetworkId || 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
      return { chainId, chainType: 'solana', provider: 'solana' }
    }
    if (namespace === 'eip155' && reference) {
      const numeric = parseInt(reference, 10)
      if (!isNaN(numeric)) {
        return { chainId: numeric, chainType: 'evm', provider: 'evm' }
      }
    }
  }
  return { chainId: 1, chainType: 'evm', provider: 'evm' }
}

function detectProviderFromCaip(caipAddress: string | undefined): string {
  if (!caipAddress) return 'walletconnect'
  const ns = caipAddress.split(':')[0]
  if (ns === 'solana') return 'solana'
  if (typeof window !== 'undefined') {
    if ((window as any).ethereum?.isMetaMask) return 'metamask'
    if ((window as any).ethereum?.isCoinbaseWallet) return 'coinbase'
    if ((window as any).ethereum?.isTrust) return 'trust'
    if ((window as any).ethereum?.isRabby) return 'rabby'
    if ((window as any).ethereum?.isOKExWallet) return 'okx'
  }
  return 'walletconnect'
}

function getSolanaSigner(): ((msg: Uint8Array) => Promise<Uint8Array>) | null {
  if (typeof window === 'undefined') return null
  const w = window as any
  if (w.solana && typeof w.solana.signMessage === 'function') {
    return async (msg: Uint8Array) => {
      const res = await w.solana.signMessage(msg, 'utf8')
      return res.signature instanceof Uint8Array ? res.signature : res
    }
  }
  if (w.phantom?.solana && typeof w.phantom.solana.signMessage === 'function') {
    return async (msg: Uint8Array) => {
      const res = await w.phantom.solana.signMessage(msg, 'utf8')
      return res.signature
    }
  }
  if (w.backpack && typeof w.backpack.signMessage === 'function') {
    return async (msg: Uint8Array) => {
      const res = await w.backpack.signMessage(msg, 'utf8')
      return res.signature || res
    }
  }
  return null
}

export function WalletConnectButton({
  className,
  variant = 'default',
  size = 'default',
  onSuccess,
  linkMode = false,
  accessToken,
}: WalletConnectButtonProps) {
  const { open } = useAppKit()
  const { address, isConnected, caipAddress } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const dispatch = useWalletDispatch()

  const [step, setStep] = useState<AuthStep>('idle')
  const [error, setError] = useState<string | null>(null)

  /**
   * Single-flight guard per (address, chain). Prevents the infinite loop that
   * was causing rate-limit hits on /auth/wallet/challenge.
   *
   * We intentionally use a `ref` here (not state) so the value persists across
   * re-renders and can't be reset by accident when callback dependencies fire.
   * On failure, we do NOT repopulate this — user must explicitly click to retry.
   */
  const ranForRef = useRef<string | null>(null)
  const inflightRef = useRef(false)

  const runAuth = useCallback(async (addr: string, chain: ResolvedChain, prov: string) => {
    const sessionKey = `${addr}|${String(chain.chainId)}`
    if (ranForRef.current === sessionKey || inflightRef.current) return
    if (!linkMode && isAuthenticated()) return

    ranForRef.current = sessionKey
    inflightRef.current = true

    let solanaSigner: ((msg: Uint8Array) => Promise<Uint8Array>) | undefined
    if (chain.chainType === 'solana') {
      const signer = getSolanaSigner()
      if (!signer) {
        const msg = 'Could not access Solana signing interface. Ensure your wallet is unlocked and connected.'
        setStep('error')
        setError(msg)
        dispatch({ type: 'SET_ERROR', error: msg })
        inflightRef.current = false
        ranForRef.current = null
        return
      }
      solanaSigner = signer
    }

    try {
      await runWalletAuthFlow({
        address: addr,
        chainId: chain.chainId,
        provider: prov,
        solanaSigner,
        onStep: (s) => {
          if (s.includes('challenge')) setStep('challenging')
          else if (s.includes('Sign')) setStep('signing')
          else if (s.includes('Verif')) setStep('verifying')
          else if (s.includes('Authenticated')) setStep('done')
        },
        onSuccess: () => {
          setStep('done')
          dispatch({ type: 'SET_AUTHENTICATED', address: addr })
          inflightRef.current = false
          setTimeout(() => {
            if (onSuccess) onSuccess()
            else if (!linkMode) window.location.href = '/'
          }, 800)
        },
        onError: (msg) => {
          setStep('error')
          setError(msg)
          dispatch({ type: 'SET_ERROR', error: msg })
          inflightRef.current = false
        },
      })
    } catch {
      inflightRef.current = false
    }
  }, [dispatch, onSuccess, linkMode])

  /**
   * Auto-trigger on wallet connect. Note: dependencies are deliberately narrow.
   * The single-flight ref protects against every other dependency changing.
   */
  useEffect(() => {
    if (!isConnected || !address) return
    if (inflightRef.current) return

    const chain = resolveChainFromCaip(caipAddress, caipNetwork?.caipNetworkId)
    const sessionKey = `${address}|${String(chain.chainId)}`
    if (ranForRef.current === sessionKey) return
    if (!linkMode && isAuthenticated()) {
      ranForRef.current = sessionKey
      setStep('done')
      return
    }

    const provider = detectProviderFromCaip(caipAddress)
    setStep('challenging')
    setError(null)
    runAuth(address, chain, provider)
  }, [isConnected, address, caipAddress, caipNetwork?.caipNetworkId, linkMode, runAuth])

  /** Reset UI-only state when wallet fully disconnects. */
  useEffect(() => {
    if (!isConnected) {
      setStep('idle')
      setError(null)
      ranForRef.current = null
      inflightRef.current = false
    }
  }, [isConnected])

  async function handleClick() {
    if (step === 'done') return
    setError(null)

    if (!isConnected) {
      setStep('connecting')
      try {
        await open()
      } catch {
        setStep('idle')
      }
      return
    }

    if (address) {
      const chain = resolveChainFromCaip(caipAddress, caipNetwork?.caipNetworkId)
      const provider = detectProviderFromCaip(caipAddress)
      /** Explicit click always allows re-run (e.g. retrying an error). */
      ranForRef.current = null
      inflightRef.current = false
      setStep('challenging')
      runAuth(address, chain, provider)
    }
  }

  const isLoading = ['connecting', 'challenging', 'signing', 'verifying'].includes(step)
  const isDone = step === 'done'
  const isError = step === 'error'

  return (
    <div className="flex flex-col gap-2">
      <Button
        id="wallet-connect-btn"
        type="button"
        variant={variant}
        size={size}
        disabled={isLoading || isDone}
        onClick={handleClick}
        className={cn(
          'relative gap-2 overflow-hidden transition-all shrink-0',
          isDone && 'bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600/20',
          isError && 'border-destructive/50',
          className
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span className="truncate">{STEP_LABELS[step]}</span>
          </>
        ) : isDone ? (
          <>
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{STEP_LABELS[step]}</span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4 shrink-0" />
            <span className="truncate">{linkMode ? 'Link Wallet' : STEP_LABELS[step]}</span>
          </>
        )}

        {isLoading && (
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        )}
      </Button>

      {isError && error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive max-w-sm">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="leading-snug">{error}</span>
        </div>
      )}
    </div>
  )
}

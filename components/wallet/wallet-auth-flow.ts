'use client'

/**
 * Wallet Auth Flow
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates: connect → challenge → sign → login → store tokens
 * Used by WalletConnectButton and LinkWallet flow.
 */

import { authApi } from '@/lib/api/auth'
import type { WalletLoginRequest } from '@/lib/api/auth'
import { storeTokens, storeWalletInfo, storeAvatar } from '@/lib/wallet/token-manager'
import { signMessage } from '@/lib/wallet/wallet-service'
import { getFriendlyError } from '@/lib/wallet/session-manager'
import { getChainType } from '@/config/wallets'

export interface AuthFlowOptions {
  address: string
  chainId: string | number
  provider: string
  /** Required only for Solana wallets */
  solanaSigner?: (msg: Uint8Array) => Promise<Uint8Array>
  onStep?: (step: string) => void
  onSuccess?: () => void
  onError?: (msg: string) => void
}

/**
 * Runs the full wallet authentication challenge/sign/login flow.
 * Returns the auth response data or throws on failure.
 */
export async function runWalletAuthFlow(opts: AuthFlowOptions): Promise<void> {
  const { address, chainId, provider, solanaSigner, onStep, onSuccess, onError } = opts

  try {
    // Step 1: Request challenge from backend
    onStep?.('Requesting challenge…')
    const challengeRes = await authApi.walletChallenge({
      address,
      chain_id: chainId,
      wallet_provider: provider,
    })

    if (!challengeRes.success || !challengeRes.data) {
      throw new Error(challengeRes.message || 'Failed to get challenge')
    }

    const { challenge_id, message } = challengeRes.data

    // Step 2: Request wallet signature
    onStep?.('Sign the message in your wallet…')
    const signature = await signMessage({
      message,
      address,
      chainId,
      solanaSigner,
    })

    // Step 3: Submit to backend
    onStep?.('Verifying signature…')
    const loginReq: WalletLoginRequest = {
      challenge_id,
      address,
      signature,
      wallet_provider: provider,
      chain_id: chainId,
    }

    const loginRes = await authApi.walletLogin(loginReq)

    if (!loginRes.success || !loginRes.data) {
      throw new Error(loginRes.message || 'Authentication failed')
    }

    const { tokens, user } = loginRes.data

    // Step 4: Store tokens (same pattern as email auth)
    storeTokens(tokens.access_token, tokens.refresh_token)
    storeWalletInfo({
      address,
      provider,
      chainId,
      type: getChainType(chainId),
    })

    if (user?.avatar) {
      storeAvatar(user.avatar)
    }

    onStep?.('Authenticated!')
    onSuccess?.()
  } catch (err: any) {
    const friendly = getFriendlyError(err?.message || String(err))
    onError?.(friendly)
    throw err
  }
}

/**
 * Runs the wallet link flow for already-authenticated users.
 * Calls POST /auth/wallet/link instead of /auth/wallet/login.
 */
export async function runWalletLinkFlow(opts: AuthFlowOptions & { accessToken: string }): Promise<void> {
  const { address, chainId, provider, solanaSigner, accessToken, onStep, onSuccess, onError } = opts

  try {
    onStep?.('Requesting challenge…')
    const challengeRes = await authApi.walletChallenge({
      address,
      chain_id: chainId,
      wallet_provider: provider,
    })

    if (!challengeRes.success || !challengeRes.data) {
      throw new Error(challengeRes.message || 'Failed to get challenge')
    }

    const { challenge_id, message } = challengeRes.data

    onStep?.('Sign the message in your wallet…')
    const signature = await signMessage({
      message,
      address,
      chainId,
      solanaSigner,
    })

    onStep?.('Linking wallet…')
    const linkRes = await authApi.linkWallet(
      { challenge_id, address, signature, wallet_provider: provider, chain_id: chainId },
      accessToken
    )

    if (!linkRes.success) {
      throw new Error(linkRes.message || 'Failed to link wallet')
    }

    onStep?.('Wallet linked!')
    onSuccess?.()
  } catch (err: any) {
    const friendly = getFriendlyError(err?.message || String(err))
    onError?.(friendly)
    throw err
  }
}

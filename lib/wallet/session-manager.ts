/**
 * Session Manager
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles session-level decisions — account changes, chain validation, etc.
 */

import { SUPPORTED_EVM_CHAIN_IDS, isChainSupported } from '@/config/wallets'

// ─── Account Change Handling ──────────────────────────────────────────────────

/**
 * Determines whether an account change requires re-authentication.
 * Returns true if the new address differs from the authenticated address.
 */
export function requiresReauth(
  newAddress: string | undefined,
  authenticatedAddress: string | null
): boolean {
  if (!newAddress || !authenticatedAddress) return false
  return newAddress.toLowerCase() !== authenticatedAddress.toLowerCase()
}

// ─── Chain Validation ─────────────────────────────────────────────────────────

export interface ChainStatus {
  supported: boolean
  chainId: string | number | null
  message: string | null
}

export function validateChain(chainId: string | number | undefined): ChainStatus {
  if (!chainId) {
    return { supported: false, chainId: null, message: 'No chain detected' }
  }

  if (!isChainSupported(chainId)) {
    return {
      supported: false,
      chainId,
      message: `Chain ${chainId} is not supported. Please switch to a supported network.`,
    }
  }

  return { supported: true, chainId, message: null }
}

// ─── Error Messages ───────────────────────────────────────────────────────────

const ERROR_MAP: Record<string, string> = {
  'user rejected': 'You rejected the connection request.',
  'user denied': 'Signature was rejected.',
  'rejected by user': 'You rejected the signature request.',
  'already pending': 'A connection request is already pending. Check your wallet.',
  'wallet not found': 'Wallet not found. Please install it and try again.',
  'chain not supported': 'This blockchain network is not supported. Please switch networks.',
  'challenge expired': 'The authentication challenge expired. Please try again.',
  'invalid signature': 'Signature verification failed. Please try again.',
  'wallet already linked': 'This wallet is already linked to an account.',
  'wallet belongs to another account': 'This wallet is linked to a different account.',
  'rate limit': 'Too many requests. Please wait a moment and try again.',
  'network error': 'Unable to connect to the server. Please check your connection.',
}

export function getFriendlyError(rawError: string): string {
  const lower = rawError.toLowerCase()
  for (const [key, msg] of Object.entries(ERROR_MAP)) {
    if (lower.includes(key)) return msg
  }
  return rawError || 'An unexpected error occurred. Please try again.'
}

// ─── Address Formatting ───────────────────────────────────────────────────────

export function formatAddress(address: string, chars = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

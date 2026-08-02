/**
 * Token Manager
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin wrapper around localStorage that mirrors the existing email auth pattern.
 * All auth token reads/writes go through this module.
 */

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_AVATAR: 'user_avatar',
  WALLET_ADDRESS: 'wallet_address',
  WALLET_PROVIDER: 'wallet_provider',
  WALLET_CHAIN_ID: 'wallet_chain_id',
  WALLET_TYPE: 'wallet_type',
} as const

// ─── Token Operations ─────────────────────────────────────────────────────────

export function storeTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken)
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.ACCESS_TOKEN)
  localStorage.removeItem(KEYS.REFRESH_TOKEN)
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEYS.ACCESS_TOKEN)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEYS.REFRESH_TOKEN)
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

// ─── Avatar Operations ────────────────────────────────────────────────────────

export function storeAvatar(avatar: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEYS.USER_AVATAR, avatar)
}

export function clearAvatar(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.USER_AVATAR)
}

export function getAvatar(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEYS.USER_AVATAR)
}

// ─── Wallet Info Operations ───────────────────────────────────────────────────

export interface StoredWalletInfo {
  address: string
  provider: string
  chainId: string | number
  type: 'evm' | 'solana'
}

export function storeWalletInfo(info: StoredWalletInfo): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEYS.WALLET_ADDRESS, info.address)
  localStorage.setItem(KEYS.WALLET_PROVIDER, info.provider)
  localStorage.setItem(KEYS.WALLET_CHAIN_ID, String(info.chainId))
  localStorage.setItem(KEYS.WALLET_TYPE, info.type)
}

export function clearWalletInfo(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.WALLET_ADDRESS)
  localStorage.removeItem(KEYS.WALLET_PROVIDER)
  localStorage.removeItem(KEYS.WALLET_CHAIN_ID)
  localStorage.removeItem(KEYS.WALLET_TYPE)
}

export function getWalletInfo(): StoredWalletInfo | null {
  if (typeof window === 'undefined') return null
  const address = localStorage.getItem(KEYS.WALLET_ADDRESS)
  const provider = localStorage.getItem(KEYS.WALLET_PROVIDER)
  const chainId = localStorage.getItem(KEYS.WALLET_CHAIN_ID)
  const type = localStorage.getItem(KEYS.WALLET_TYPE)
  if (!address || !provider || !chainId || !type) return null
  return {
    address,
    provider,
    chainId,
    type: type as 'evm' | 'solana',
  }
}

// ─── Full Clear ───────────────────────────────────────────────────────────────

export function clearAllAuth(): void {
  clearTokens()
  clearAvatar()
  clearWalletInfo()
}

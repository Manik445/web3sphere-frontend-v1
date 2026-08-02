/**
 * Wallet Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Chain-agnostic wallet operations built around Reown AppKit + WalletConnect.
 * Isolates wallet connectivity from authentication logic.
 *
 * Signing architecture:
 *   EVM:    wagmi/actions → signMessage (uses AppKit wagmi-adapter config)
 *   Solana: AppKit Solana adapter programmatic client → signMessage
 *   Both routes share WalletConnect v2 transport and the unified AppKit modal.
 */

import { getChainType, getExplorerAddressUrl } from '@/config/wallets'

export async function signMessageEVM(message: string, address: string): Promise<string> {
  const { signMessage } = await import('wagmi/actions')
  const { getConfig } = await import('@/lib/wallet/appkit-config')
  const config = getConfig()
  const signature = await signMessage(config, {
    message,
    account: address as `0x${string}`,
  })
  return signature
}

/**
 * Sign a message using a Solana wallet via the AppKit Solana adapter programmatic signer.
 * Accepts a signer callback obtained from the React layer using
 * the `@reown/appkit-adapter-solana/react` hooks (WalletConnect-powered).
 */
export async function signMessageSolana(
  message: string,
  signer: (msg: Uint8Array) => Promise<Uint8Array>
): Promise<string> {
  const encoded = new TextEncoder().encode(message)
  const signature = await signer(encoded)
  return Array.from(signature)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export interface SignOptions {
  message: string
  address: string
  chainId: string | number
  solanaSigner?: (msg: Uint8Array) => Promise<Uint8Array>
}

export async function signMessage(opts: SignOptions): Promise<string> {
  const chainType = getChainType(opts.chainId)

  if (chainType === 'solana') {
    if (!opts.solanaSigner) {
      throw new Error('Solana signer callback is required for Solana wallet signing.')
    }
    return signMessageSolana(opts.message, opts.solanaSigner)
  }

  return signMessageEVM(opts.message, opts.address)
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export { getExplorerAddressUrl as getExplorerUrl }

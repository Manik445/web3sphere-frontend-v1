/**
 * Reown AppKit Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Single integration built entirely around Reown AppKit + WalletConnect.
 * Handles BOTH EVM and Solana wallet connectivity through one unified modal.
 * The Go backend owns challenge generation, signature verification,
 * JWT issuance, refresh token rotation, and session management.
 *
 * Wallet support (all routed through WalletConnect protocol):
 *   EVM: MetaMask, Coinbase Wallet, Trust Wallet, Rabby, Rainbow, OKX, Brave, Zerion, Ledger
 *   Solana: Phantom, Solflare, Backpack
 *   Future: Any WalletConnect-compatible wallet
 *
 * Must be imported at module level before any AppKit hooks are used.
 */

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import {
  mainnet,
  sepolia,
  polygon,
  arbitrum,
  optimism,
  base,
  bsc,
  avalanche,
} from '@reown/appkit/networks'
import { solana, solanaDevnet } from '@reown/appkit/networks'
import type { Config } from 'wagmi'

// ─── Project Config ───────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// ─── Supported Networks ───────────────────────────────────────────────────────

export const EVM_NETWORKS = [mainnet, sepolia, polygon, arbitrum, optimism, base, bsc, avalanche] as const
export const SOLANA_NETWORKS = [solana, solanaDevnet] as const
export const ALL_NETWORKS = [...EVM_NETWORKS, ...SOLANA_NETWORKS] as const

// ─── Wagmi Adapter (EVM) ──────────────────────────────────────────────────────

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [...EVM_NETWORKS],
})

// ─── Solana Adapter ───────────────────────────────────────────────────────────
/**
 * SolanaAdapter configured without direct Solana wallet-adapter injected wallets.
 * All Solana connectivity flows through WalletConnect protocol, matching the
 * unified AppKit modal and the same WalletConnect v2 transport.
 */
export const solanaAdapter = new SolanaAdapter({
  wallets: [],
})

// ─── App Metadata ─────────────────────────────────────────────────────────────

const metadata = {
  name: 'Web3Sphere',
  description: 'The On-Chain Home for Builders — decentralized identity, community, and crypto payments.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://web3sphere.io',
  icons: ['/icon.png'],
}

// ─── AppKit Initialization ────────────────────────────────────────────────────

let appKitInitialized = false

export function initAppKit() {
  if (appKitInitialized) return
  appKitInitialized = true

  createAppKit({
    adapters: [wagmiAdapter, solanaAdapter],
    networks: [...ALL_NETWORKS] as any,
    defaultNetwork: mainnet,
    projectId,
    metadata,
    features: {
      analytics: false,
      email: false,
      socials: false,
    },
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': 'oklch(0.72 0.16 235)',
      '--w3m-color-mix': 'oklch(0.14 0.015 255)',
      '--w3m-color-mix-strength': 40,
      '--w3m-font-family': 'var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif',
      '--w3m-border-radius-master': '12px',
    },
    featuredWalletIds: [
      // MetaMask
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
      // Coinbase
      'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
      // Trust Wallet
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
      // Rainbow
      '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
    ],
  })
}

// ─── Config Accessor ──────────────────────────────────────────────────────────

export function getConfig(): Config {
  return wagmiAdapter.wagmiConfig as Config
}

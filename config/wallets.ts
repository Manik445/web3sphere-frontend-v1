/**
 * Wallet & Chain Registry
 * ─────────────────────────────────────────────────────────────────────────────
 * To add a new wallet or chain, only edit this file.
 * The rest of the application reads from these configurations at runtime.
 */

// ─── Chain Types ─────────────────────────────────────────────────────────────

export type ChainType = 'evm' | 'solana'

export interface ChainConfig {
  id: string | number
  name: string
  type: ChainType
  nativeCurrency: { name: string; symbol: string; decimals: number }
  rpcUrl: string
  explorerUrl: string
  icon?: string
  testnet?: boolean
}

export interface WalletConfig {
  id: string
  name: string
  shortName: string
  icon: string
  chainType: ChainType | 'both'
  deepLink?: string
  downloadUrl?: string
  /** WalletConnect rdns identifier (EIP-6963) */
  rdns?: string
}

// ─── EVM Chains ──────────────────────────────────────────────────────────────

export const EVM_CHAINS: ChainConfig[] = [
  {
    id: 1,
    name: 'Ethereum',
    type: 'evm',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://cloudflare-eth.com',
    explorerUrl: 'https://etherscan.io',
    icon: '⟠',
  },
  {
    id: 11155111,
    name: 'Sepolia',
    type: 'evm',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://rpc.sepolia.org',
    explorerUrl: 'https://sepolia.etherscan.io',
    icon: '⟠',
    testnet: true,
  },
  {
    id: 137,
    name: 'Polygon',
    type: 'evm',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    icon: '⬡',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    type: 'evm',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    icon: '🔵',
  },
  {
    id: 10,
    name: 'Optimism',
    type: 'evm',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    icon: '🔴',
  },
  {
    id: 8453,
    name: 'Base',
    type: 'evm',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    icon: '🔷',
  },
  {
    id: 56,
    name: 'BNB Chain',
    type: 'evm',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    icon: '🟡',
  },
  {
    id: 43114,
    name: 'Avalanche',
    type: 'evm',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    icon: '🔺',
  },
]

// ─── Solana Chains ────────────────────────────────────────────────────────────

export const SOLANA_CHAINS: ChainConfig[] = [
  {
    id: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    name: 'Solana',
    type: 'solana',
    nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    icon: '◎',
  },
  {
    id: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    name: 'Solana Devnet',
    type: 'solana',
    nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
    rpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    icon: '◎',
    testnet: true,
  },
]

export const ALL_CHAINS: ChainConfig[] = [...EVM_CHAINS, ...SOLANA_CHAINS]

export const SUPPORTED_EVM_CHAIN_IDS: number[] = EVM_CHAINS.map((c) => c.id as number)

// ─── Wallet Registry ─────────────────────────────────────────────────────────

export const WALLET_REGISTRY: WalletConfig[] = [
  // EVM Wallets
  {
    id: 'metamask',
    name: 'MetaMask',
    shortName: 'MM',
    icon: '🦊',
    chainType: 'evm',
    rdns: 'io.metamask',
    downloadUrl: 'https://metamask.io',
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    shortName: 'CB',
    icon: '🔵',
    chainType: 'evm',
    rdns: 'com.coinbase.wallet',
    downloadUrl: 'https://www.coinbase.com/wallet',
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    shortName: 'TW',
    icon: '🛡️',
    chainType: 'evm',
    rdns: 'com.trustwallet.app',
    downloadUrl: 'https://trustwallet.com',
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    shortName: 'RB',
    icon: '🌈',
    chainType: 'evm',
    rdns: 'me.rainbow',
    downloadUrl: 'https://rainbow.me',
  },
  {
    id: 'rabby',
    name: 'Rabby',
    shortName: 'RY',
    icon: '🐰',
    chainType: 'evm',
    rdns: 'io.rabby',
    downloadUrl: 'https://rabby.io',
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    shortName: 'OK',
    icon: '⭕',
    chainType: 'evm',
    rdns: 'com.okex.wallet',
    downloadUrl: 'https://www.okx.com/web3',
  },
  {
    id: 'brave',
    name: 'Brave Wallet',
    shortName: 'BW',
    icon: '🦁',
    chainType: 'evm',
    rdns: 'com.brave.wallet',
  },
  {
    id: 'zerion',
    name: 'Zerion',
    shortName: 'ZR',
    icon: '⚡',
    chainType: 'evm',
    rdns: 'io.zerion.wallet',
    downloadUrl: 'https://zerion.io',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    shortName: 'LG',
    icon: '🔒',
    chainType: 'evm',
    downloadUrl: 'https://www.ledger.com',
  },
  // Solana Wallets
  {
    id: 'phantom',
    name: 'Phantom',
    shortName: 'PH',
    icon: '👻',
    chainType: 'solana',
    rdns: 'app.phantom',
    downloadUrl: 'https://phantom.app',
  },
  {
    id: 'solflare',
    name: 'Solflare',
    shortName: 'SF',
    icon: '🌟',
    chainType: 'solana',
    downloadUrl: 'https://solflare.com',
  },
  {
    id: 'backpack',
    name: 'Backpack',
    shortName: 'BP',
    icon: '🎒',
    chainType: 'solana',
    downloadUrl: 'https://backpack.app',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getChainById(id: string | number): ChainConfig | undefined {
  return ALL_CHAINS.find((c) => c.id === id || String(c.id) === String(id))
}

export function getWalletById(id: string): WalletConfig | undefined {
  return WALLET_REGISTRY.find((w) => w.id === id)
}

export function isChainSupported(chainId: string | number): boolean {
  return !!getChainById(chainId)
}

export function getChainType(chainId: string | number): ChainType {
  const chain = getChainById(chainId)
  if (chain?.type === 'solana') return 'solana'
  return 'evm'
}

export function getExplorerAddressUrl(address: string, chainId: string | number): string {
  const chain = getChainById(chainId)
  if (!chain) return `https://etherscan.io/address/${address}`
  if (chain.type === 'solana') {
    const cluster = chain.testnet ? '?cluster=devnet' : ''
    return `${chain.explorerUrl}/address/${address}${cluster}`
  }
  return `${chain.explorerUrl}/address/${address}`
}

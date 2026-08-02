'use client'

/**
 * Wallet Context
 * ─────────────────────────────────────────────────────────────────────────────
 * Global state for wallet connection + authentication.
 * Separate from wallet connectivity — uses a simple reducer pattern.
 */

import { createContext, useContext, useReducer, type ReactNode } from 'react'

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface ConnectedWallet {
  address: string
  chainId: string | number
  provider: string
  type: 'evm' | 'solana'
}

export interface WalletState {
  /** The currently connected wallet (may differ from authenticated wallet) */
  connectedWallet: ConnectedWallet | null
  /** The address that has been authenticated with the backend */
  authenticatedAddress: string | null
  /** Whether the user has a valid backend session */
  isAuthenticated: boolean
  /** Auth flow in progress */
  authLoading: boolean
  /** Last wallet-related error */
  walletError: string | null
  /** Whether to show the account-switched prompt */
  showSwitchPrompt: boolean
  /** Chain is unsupported */
  chainUnsupported: boolean
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type WalletAction =
  | { type: 'SET_CONNECTED_WALLET'; wallet: ConnectedWallet | null }
  | { type: 'SET_AUTHENTICATED'; address: string }
  | { type: 'SET_AUTH_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_SWITCH_PROMPT'; show: boolean }
  | { type: 'SET_CHAIN_UNSUPPORTED'; unsupported: boolean }
  | { type: 'RESET' }

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: WalletState = {
  connectedWallet: null,
  authenticatedAddress: null,
  isAuthenticated: false,
  authLoading: false,
  walletError: null,
  showSwitchPrompt: false,
  chainUnsupported: false,
}

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'SET_CONNECTED_WALLET':
      return { ...state, connectedWallet: action.wallet, walletError: null }

    case 'SET_AUTHENTICATED':
      return {
        ...state,
        authenticatedAddress: action.address,
        isAuthenticated: true,
        authLoading: false,
        walletError: null,
        showSwitchPrompt: false,
      }

    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.loading, walletError: null }

    case 'SET_ERROR':
      return { ...state, walletError: action.error, authLoading: false }

    case 'SET_SWITCH_PROMPT':
      return { ...state, showSwitchPrompt: action.show }

    case 'SET_CHAIN_UNSUPPORTED':
      return { ...state, chainUnsupported: action.unsupported }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface WalletContextValue {
  state: WalletState
  dispatch: React.Dispatch<WalletAction>
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(walletReducer, initialState)

  return (
    <WalletContext.Provider value={{ state, dispatch }}>
      {children}
    </WalletContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWalletContext(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWalletContext must be used inside WalletProvider')
  return ctx
}

export function useWalletState(): WalletState {
  return useWalletContext().state
}

export function useWalletDispatch(): React.Dispatch<WalletAction> {
  return useWalletContext().dispatch
}

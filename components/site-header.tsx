'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut, User, Wallet as WalletIcon, CreditCard } from 'lucide-react'
import { Logo } from '@/components/logo'
import { NotificationBell } from '@/components/notification-bell'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { authApi } from '@/lib/api/auth'
import { ConnectedWalletBadge } from '@/components/wallet/connected-wallet-badge'
import { WalletSwitchPrompt } from '@/components/wallet/wallet-switch-prompt'
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button'

const NAV = [
  { label: 'Community', href: '/#community' },
  { label: 'Explore', href: '/explore' },
  { label: 'Learn', href: '/learn' },
  { label: 'Hire', href: '/hire' },
  { label: 'Mentorship', href: '/mentorship' },
  { label: 'Referral', href: '/referral' },
  { label: 'Payments', href: '/payments' },
]

/**
 * SiteHeader — three-column grid layout with overlap guards
 *
 *  [Logo] ─────left─────┐      ┌──center (flex)──┐      ┌──────right────── [Bell · Profile · Wallet]
 *                       │      │                  │      │
 *   + shrink-0          │      │  flex-1 nav      │      │   shrink-0 cluster
 *   + min-w-0 on nav    │      │  truncate/ellipsis      │   nowrap, min gap
 *   + xl vs lg: nav density
 */

export function SiteHeader() {
  const avatarDropdownRef = useRef<HTMLDivElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('access_token')
    setAuthenticated(Boolean(t))
    setAvatar(localStorage.getItem('user_avatar'))
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownOpen && avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  async function handleLogout() {
    try {
      const token = localStorage.getItem('access_token')
      if (token) await authApi.logout(token)
    } catch {
      /* ignore */
    } finally {
      localStorage.removeItem('user_avatar')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-[1480px] items-center gap-4 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
        {/* Left column: Logo — fixed leftmost, never shrinks */}
        <div className="flex shrink-0 items-center gap-2">
          <Logo />
        </div>

        {/* Middle column: Primary nav, full labels, center aligned */}
        <nav
          className="hidden min-w-0 flex-1 items-center justify-center lg:flex"
          aria-label="Primary"
        >
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-border/60 bg-muted/30 px-2 py-1.5 shadow-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex-1 lg:hidden" aria-hidden />

        {/* Right column: Action cluster — pinned to rightmost, nowrap */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <NotificationBell />

          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <ConnectedWalletBadge />

            {authenticated && avatar ? (
              <div className="relative" ref={avatarDropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="group flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-transform active:scale-95 shrink-0"
                  aria-label="Profile menu"
                  dangerouslySetInnerHTML={{ __html: avatar }}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border/80 bg-card/95 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl z-[60] animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-3 border-b border-border/60 px-3 py-2.5">
                      <div
                        className="h-9 w-9 shrink-0 rounded-full overflow-hidden border border-border"
                        dangerouslySetInnerHTML={{ __html: avatar }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">My Account</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {localStorage.getItem('wallet_address')?.slice(0, 10) ?? 'Signed in'}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <User className="h-4 w-4 shrink-0" />
                      Profile
                    </Link>
                    <Link
                      href="/profile?tab=wallets"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <WalletIcon className="h-4 w-4 shrink-0" />
                      Linked Wallets
                    </Link>
                    <Link
                      href="/payments"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <CreditCard className="h-4 w-4 shrink-0" />
                      Payments & History
                    </Link>
                    <div className="mt-1 border-t border-border/60 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout()
                          setDropdownOpen(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'h-10 rounded-full px-4 text-sm shrink-0 whitespace-nowrap'
                )}
              >
                Log in
              </Link>
            )}

            <WalletConnectButton
              className="h-10 gap-2 rounded-full px-4 text-sm shrink-0 whitespace-nowrap"
            />
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground md:hidden shrink-0"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Global wallet switch guard */}
      <WalletSwitchPrompt />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border/70 bg-background/95 backdrop-blur md:hidden animate-in fade-in slide-in-from-top-2">
          <nav className="mx-auto flex max-w-[1480px] flex-col gap-1 px-4 py-4" aria-label="Mobile">
            <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5">
              <span className="text-sm font-medium text-muted-foreground">Web3Sphere</span>
            </div>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border/70 pt-3">
              <ConnectedWalletBadge />
              {avatar ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-3">
                    <div
                      className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-border"
                      dangerouslySetInnerHTML={{ __html: avatar }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">My Account</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {localStorage.getItem('wallet_address')?.slice(0, 12) ?? 'Signed in'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/profile?tab=wallets"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Linked Wallets
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                    className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants({ variant: 'outline' }), 'h-11')}
                >
                  Log in
                </Link>
              )}
              <WalletConnectButton
                className="h-11 gap-2"
                onSuccess={() => setMobileOpen(false)}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

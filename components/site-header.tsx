'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Wallet } from 'lucide-react'
import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/mode-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { authApi } from '@/lib/api/auth'

const NAV = [
  { label: 'Community', href: '/#community' },
  { label: 'Moats', href: '/#moats' },
  { label: 'Hire', href: '/hire' },
  { label: 'Payments', href: '/payments' },
]

export function SiteHeader() {
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownOpen && avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    setAvatar(localStorage.getItem('user_avatar'))
  }, [])

  async function handleLogout() {
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        await authApi.logout(token)
      }
    } catch (e) {
      console.error(e)
    } finally {
      localStorage.removeItem('user_avatar')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/'
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />
          {avatar ? (
            <div className="relative" ref={avatarDropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-10 w-10 overflow-hidden rounded-full border border-border bg-muted flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                dangerouslySetInnerHTML={{ __html: avatar }}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 flex flex-col gap-1 rounded-xl border border-border bg-card p-1 shadow-lg z-50">
                  <Link
                    href="/profile"
                    onClick={() => { setDropdownOpen(false); }}
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setDropdownOpen(false); }}
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'ghost' }), 'h-10 px-4 text-sm')}
            >
              Log in
            </Link>
          )}
          <Link
            href="/signup"
            className={cn(buttonVariants(), 'h-10 gap-2 rounded-full px-5 text-sm')}
          >
            <Wallet className="h-4 w-4" />
            Connect
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border glass md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/40 px-3 py-2.5">
              <span className="text-sm font-medium text-muted-foreground">Your track</span>
              <ModeToggle />
            </div>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {avatar ? (
                <>
                  <div className="flex justify-center py-2">
                    <div 
                      className="h-12 w-12 overflow-hidden rounded-full border border-border bg-muted"
                      dangerouslySetInnerHTML={{ __html: avatar }}
                    />
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); }}
                    className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: 'outline' }), 'h-11')}
                >
                  Log in
                </Link>
              )}
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants(), 'h-11 gap-2')}
              >
                <Wallet className="h-4 w-4" />
                Connect
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button'
import { useAppKit } from '@reown/appkit/react'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* glowing arc backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-1/2 h-[120vh] w-[120vh] -translate-y-1/2 rounded-full bg-primary/20 blur-[130px]" />
        <div className="absolute left-[-10%] top-1/2 h-[90vh] w-[90vh] -translate-y-1/2 rounded-full border border-primary/20" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="relative flex min-h-dvh flex-col">
        <header className="flex items-center justify-between px-6 py-6">
          <Logo />
          <p className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground sm:block">
            SYS.CORE // ON-LINE
          </p>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-10 md:justify-end md:px-16">
          {children}
        </main>

        <footer className="px-6 py-5">
          <p className="font-mono text-xs text-muted-foreground">UPLINK_ESTABLISHED_</p>
        </footer>
      </div>
    </div>
  )
}

export function OrDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

/**
 * WalletButtons — replaced with real AppKit-powered connect button.
 * Clicking opens the WalletConnect modal; on connect the auth flow
 * (challenge → sign → login) runs automatically.
 */
export function WalletButtons() {
  return (
    <div className="flex flex-col gap-3">
      <WalletConnectButton
        className="h-12 w-full rounded-xl text-sm"
        variant="outline"
      />
      <OpenModalButton />
    </div>
  )
}

/** Secondary button that opens the AppKit modal directly */
function OpenModalButton() {
  const { open } = useAppKit()
  return (
    <button
      type="button"
      onClick={() => open({ view: 'Networks' })}
      className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
      aria-label="Browse all wallets and networks"
    >
      <span className="font-mono">Browse all wallets & networks</span>
    </button>
  )
}

export function AuthAltLink({
  prompt,
  href,
  label,
}: {
  prompt: string
  href: string
  label: string
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{' '}
      <Link href={href} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    </p>
  )
}

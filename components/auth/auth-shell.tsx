import Link from 'next/link'
import { Logo } from '@/components/logo'

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

export function WalletButtons() {
  const wallets = [
    { name: 'MetaMask', short: 'MM' },
    { name: 'WalletConnect', short: 'WC' },
    { name: 'Coinbase', short: 'CB' },
  ]
  return (
    <div className="grid grid-cols-3 gap-3">
      {wallets.map((w) => (
        <button
          key={w.name}
          type="button"
          className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-secondary/40 text-foreground transition-all hover:border-primary/50 hover:bg-secondary"
          aria-label={`Connect with ${w.name}`}
        >
          <span className="font-mono text-sm font-bold">{w.short}</span>
          <span className="text-[10px] text-muted-foreground">{w.name}</span>
        </button>
      ))}
    </div>
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

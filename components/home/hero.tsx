'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useMode } from '@/components/mode-provider'
import { NetworkCanvas } from '@/components/network-canvas'
import { cn } from '@/lib/utils'

const CONTENT = {
  web3: {
    eyebrow: 'Web3 · Crypto · DeFi',
    title: 'The operating system for the',
    highlight: 'decentralized internet',
    body: 'Just as the internet created the cloud, Web3Sphere creates the infrastructure that connects talent, capital, and innovation across borders — where reputation is on-chain, work is verifiable, and payment is instant.',
    primaryCta: 'Claim your on-chain identity',
    note: 'Wallet-based login · No seed phrase ever leaves your device',
    stats: [
      { value: '148K+', label: 'Verified builders' },
      { value: '$2.4B', label: 'On-chain volume' },
      { value: '9.6K', label: 'Community rooms' },
    ],
  },
  ai: {
    eyebrow: 'AI · ML · Research',
    title: 'The intelligence layer for the',
    highlight: 'builders of tomorrow',
    body: 'Where AI researchers, engineers, and founders converge — transparent on-chain portfolios, collaborative debugging, and access to the best minds building the future of machine learning, all backed by cryptographic proof of contribution.',
    primaryCta: 'Build your AI identity',
    note: 'Verified contributions · Your work, provably yours',
    stats: [
      { value: '52K+', label: 'AI builders' },
      { value: '3.1K', label: 'Models tracked' },
      { value: '12K', label: 'Research digests' },
    ],
  },
} as const

export function Hero() {
  const { mode } = useMode()
  const c = CONTENT[mode]

  return (
    <section className="relative overflow-hidden">
      {/* animated network + glow backdrop with Web3/AI effects */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <NetworkCanvas className="opacity-60" density={54} />
        {/* Primary glow: crypto-inspired drifting orb */}
        <div className="absolute left-1/2 top-[-10rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] animate-blockchain" />
        {/* Secondary glow: AI-inspired pulsing accent */}
        <div className="absolute right-[-8rem] top-40 h-[24rem] w-[24rem] rounded-full bg-[var(--chart-4)]/10 blur-[120px] animate-glow-pulse" />
        {/* Grid: subtle on-chain ledger aesthetic */}
        <div
          className="absolute inset-0 opacity-[0.05] animate-grid-pan"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        {/* Flow effect: representing data flow across the network */}
        <div className="absolute left-0 top-1/4 h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-flow" />
        <div className="absolute right-1/3 top-1/3 h-0.5 w-1/2 bg-gradient-to-r from-[var(--chart-4)]/0 via-[var(--chart-4)]/40 to-transparent animate-flow" style={{ animationDelay: '1.2s' }} />
        {/* Fade overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 md:px-6 md:pb-28 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="reveal is-visible inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground glass">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {c.eyebrow}
          </span>

          <h1 className="reveal is-visible mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl" style={{ animationDelay: '80ms' }}>
            {c.title}{' '}
            <span className="text-primary text-glow">{c.highlight}</span>
          </h1>

          <p className="reveal is-visible mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg" style={{ animationDelay: '160ms' }}>
            {c.body}
          </p>

          <div className="reveal is-visible mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '240ms' }}>
            <Link
              href="/signup"
              className={cn(buttonVariants(), 'h-12 gap-2 rounded-full px-7 text-base transition-transform hover:-translate-y-0.5')}
            >
              {c.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#markets"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-12 rounded-full px-7 text-base')}
            >
              Explore live markets
            </Link>
          </div>

          <p className="reveal is-visible mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground" style={{ animationDelay: '320ms' }}>
            <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
            {c.note}
          </p>
        </div>

        <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {c.stats.map((stat, i) => (
            <div
              key={stat.label}
              className="reveal is-visible group relative rounded-2xl border border-border bg-card/50 p-6 text-center glass transition-all hover:border-primary/40 hover:bg-card/70"
              style={{ animationDelay: `${400 + i * 90}ms` }}
            >
              {/* Subtle crypto glow on hover */}
              <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
              <dt className="sr-only">{stat.label}</dt>
              <dd className="relative text-3xl font-bold tracking-tight text-foreground group-hover:animate-glow-pulse">{stat.value}</dd>
              <p className="relative mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

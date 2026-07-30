'use client'

import { Sparkles } from 'lucide-react'

const PARTNERS = [
  { name: 'Binance', category: 'Exchange', abbr: 'BNB', color: '#F3BA2F' },
  { name: 'Coinbase', category: 'Exchange', abbr: 'CB', color: '#0052FF' },
  { name: 'Kraken', category: 'Exchange', abbr: 'KRK', color: '#5741D9' },
  { name: 'MetaMask', category: 'Wallet', abbr: 'MM', color: '#E2761B' },
  { name: 'Phantom', category: 'Wallet', abbr: 'PHM', color: '#AB9FF2' },
  { name: 'Alchemy', category: 'Infrastructure', abbr: 'ALY', color: '#0C6CFC' },
  { name: 'Infura', category: 'Infrastructure', abbr: 'INF', color: '#FF6C37' },
  { name: 'OpenAI', category: 'AI Partner', abbr: 'OAI', color: '#10A37F' },
  { name: 'Anthropic', category: 'AI Partner', abbr: 'ANT', color: '#D97706' },
  { name: 'Uniswap', category: 'Ecosystem', abbr: 'UNI', color: '#FF007A' },
  { name: 'Chainlink', category: 'Ecosystem', abbr: 'LINK', color: '#375BD2' },
  { name: 'Y Combinator', category: 'Accelerator', abbr: 'YC', color: '#F26625' },
  { name: 'a16z Crypto', category: 'Accelerator', abbr: 'A16Z', color: '#764ABC' },
  { name: 'MIT', category: 'University', abbr: 'MIT', color: '#A31F34' },
  { name: 'Polygon', category: 'Ecosystem', abbr: 'MATIC', color: '#8247E5' },
  { name: 'Solana Fdn', category: 'Ecosystem', abbr: 'SOL', color: '#9945FF' },
]

// Double for seamless loop
const LOOP = [...PARTNERS, ...PARTNERS]

export function TrustedBy() {
  return (
    <section className="relative overflow-hidden border-t border-border py-20 md:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Ecosystem
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Trusted by the builders behind
            <span className="shimmer-text"> Web3 & AI</span>
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            From top-tier exchanges to leading research institutions — Web3Sphere is where the ecosystem converges.
          </p>
        </div>
      </div>

      {/* Scrolling partner cards */}
      <div className="relative mt-14 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div
          className="flex gap-5"
          style={{
            width: 'max-content',
            animation: 'ticker 60s linear infinite',
          }}
        >
          {LOOP.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="group relative flex w-52 flex-shrink-0 flex-col items-center gap-3 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-card hover:shadow-[0_0_24px_rgba(0,0,0,0.3)]"
              style={{ cursor: 'default' }}
            >
              {/* Glow on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse at center, ${partner.color}18 0%, transparent 70%)`,
                }}
              />

              {/* Logo placeholder circle */}
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${partner.color}cc, ${partner.color}66)` }}
              >
                {partner.abbr}
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{partner.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{partner.category}</p>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-1/4 right-1/4 h-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${partner.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { Sparkles, ArrowUpRight, ArrowDownRight, Star, Shield, Brain, TrendingUp, Globe } from 'lucide-react'

type Tab = 'hall-of-fame' | 'trending' | 'weekly' | 'monthly'

const EXCHANGES = [
  {
    name: 'Binance',
    abbr: 'BNB',
    color: '#F3BA2F',
    country: '🇲🇹 Malta',
    rating: 4.8,
    trustScore: 96,
    sentiment: 92,
    aiConfidence: 94,
    reviews: 14200,
    change: 1.2,
    category: 'CEX',
    tags: ['High Liquidity', 'Regulated', 'Builder Verified'],
  },
  {
    name: 'Coinbase',
    abbr: 'CB',
    color: '#0052FF',
    country: '🇺🇸 USA',
    rating: 4.6,
    trustScore: 98,
    sentiment: 88,
    aiConfidence: 91,
    reviews: 9800,
    change: 0.5,
    category: 'CEX',
    tags: ['SEC Registered', 'Institutional', 'Builder Verified'],
  },
  {
    name: 'Kraken',
    abbr: 'KRK',
    color: '#5741D9',
    country: '🇺🇸 USA',
    rating: 4.5,
    trustScore: 95,
    sentiment: 85,
    aiConfidence: 89,
    reviews: 7300,
    change: -0.3,
    category: 'CEX',
    tags: ['Security First', 'Regulated'],
  },
  {
    name: 'Uniswap',
    abbr: 'UNI',
    color: '#FF007A',
    country: '🌐 Global',
    rating: 4.7,
    trustScore: 93,
    sentiment: 90,
    aiConfidence: 92,
    reviews: 6100,
    change: 2.1,
    category: 'DEX',
    tags: ['Decentralized', 'Open Source', 'Audited'],
  },
  {
    name: 'dYdX',
    abbr: 'DYDX',
    color: '#6966FF',
    country: '🌐 Global',
    rating: 4.4,
    trustScore: 91,
    sentiment: 87,
    aiConfidence: 88,
    reviews: 3900,
    change: 1.7,
    category: 'DEX',
    tags: ['Derivatives', 'L2', 'Audited'],
  },
  {
    name: 'OKX',
    abbr: 'OKX',
    color: '#000000',
    country: '🇸🇬 Seychelles',
    rating: 4.3,
    trustScore: 89,
    sentiment: 82,
    aiConfidence: 85,
    reviews: 8600,
    change: -1.1,
    category: 'CEX',
    tags: ['Global', 'Web3 Wallet'],
  },
]

const TABS: { id: Tab; label: string }[] = [
  { id: 'hall-of-fame', label: '🏆 Hall of Fame' },
  { id: 'trending', label: '🔥 Trending' },
  { id: 'weekly', label: '📈 Weekly Movers' },
  { id: 'monthly', label: '📅 Monthly Top' },
]

export function DexRatings() {
  const [tab, setTab] = useState<Tab>('hall-of-fame')

  return (
    <section id="dex-ratings" className="relative border-t border-border py-20 md:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-32 bottom-32 h-64 w-64 rounded-full bg-chart-4/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Shield className="h-3.5 w-3.5" />
            Community Intelligence
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            CEX & DEX{' '}
            <span className="shimmer-text">Community Ratings</span>
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Exchange rankings powered by verified builders. Every rating is weighted by Builder Score, XP, NFT badges, and community participation.
          </p>
        </div>

        {/* Tab selector */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-xl border border-border bg-card/40 p-1 backdrop-blur-sm">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exchange cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {EXCHANGES.map((ex, i) => (
            <div
              key={ex.name}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg"
            >
              {/* Rank badge */}
              <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                #{i + 1}
              </div>

              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${ex.color}cc, ${ex.color}88)` }}
                >
                  {ex.abbr}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{ex.name}</h3>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {ex.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {ex.country}
                  </div>
                </div>
              </div>

              {/* Rating row */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={`h-3.5 w-3.5 ${si < Math.floor(ex.rating) ? 'fill-[#F3BA2F] text-[#F3BA2F]' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-semibold text-foreground">{ex.rating}</span>
                  <span className="text-xs text-muted-foreground">({(ex.reviews / 1000).toFixed(1)}k)</span>
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${ex.change >= 0 ? 'text-[var(--success)]' : 'text-destructive'}`}>
                  {ex.change >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(ex.change)}%
                </div>
              </div>

              {/* Score bars */}
              <div className="mt-4 space-y-2.5">
                <ScoreBar label="Trust Score" value={ex.trustScore} color="var(--success)" />
                <ScoreBar label="Community Sentiment" value={ex.sentiment} color="var(--primary)" />
                <ScoreBar label="AI Confidence" value={ex.aiConfidence} color="var(--chart-4)" icon={<Brain className="h-3 w-3" />} />
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {ex.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 rounded-xl border border-border bg-card/30 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Ratings are weighted by:</span> Builder Score · XP · Verified Credentials · NFT Badges · Community Participation · Historical Review Quality
          </p>
        </div>
      </div>
    </section>
  )
}

function ScoreBar({
  label,
  value,
  color,
  icon,
}: {
  label: string
  value: number
  color: string
  icon?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className="text-xs font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  )
}

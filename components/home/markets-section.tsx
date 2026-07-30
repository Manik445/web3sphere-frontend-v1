'use client'

import useSWR from 'swr'
import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react'
import type { Coin } from '@/app/api/prices/route'
import { fetcher, formatCompact, formatPct, formatUsd } from '@/lib/format'
import { cn } from '@/lib/utils'

export function MarketsSection() {
  const { data, isLoading } = useSWR<{ coins: Coin[]; source: string }>('/api/prices', fetcher, {
    refreshInterval: 60_000,
  })

  const coins = (data?.coins ?? []).slice(0, 8)

  return (
    <section id="markets" className="relative border-t border-border py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary">Markets · Signal · Intelligence</span>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Live market data fused with on-chain signal
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
              Transparent asset prices, DEX/CEX ratings, whale tracking, and AI sentiment — all refreshing live so you
              never trade behind the curve.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
            <RefreshCw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
            {data?.source === 'fallback' ? 'CACHED · No downtime' : 'LIVE · 60s'}
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {coins.map((coin) => {
            const up = coin.change24h >= 0
            return (
              <div
                key={coin.id}
                className="group rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-primary/40 hover:bg-card"
              >
                <div className="flex items-center gap-3">
                  {coin.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coin.image || '/placeholder.svg'} alt="" className="h-9 w-9 rounded-full" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-mono text-xs font-bold text-foreground">
                      {coin.symbol.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{coin.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{coin.symbol}</p>
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{formatUsd(coin.price)}</p>

                <div className="mt-1 flex items-center justify-between">
                  <span
                    className={cn(
                      'flex items-center gap-0.5 text-sm font-medium',
                      up ? 'text-[var(--success)]' : 'text-destructive',
                    )}
                  >
                    {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {formatPct(coin.change24h)}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    MC ${formatCompact(coin.marketCap)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

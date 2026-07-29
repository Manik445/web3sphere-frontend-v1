'use client'

import useSWR from 'swr'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { Coin } from '@/app/api/prices/route'
import { fetcher, formatPct, formatUsd } from '@/lib/format'
import { cn } from '@/lib/utils'

export function CryptoTicker() {
  const { data } = useSWR<{ coins: Coin[]; source: string }>('/api/prices', fetcher, {
    refreshInterval: 60_000,
  })

  const coins = data?.coins ?? []
  if (coins.length === 0) {
    return <div className="h-10 border-y border-border bg-card/40" aria-hidden="true" />
  }

  // Duplicate the list for a seamless marquee loop.
  const loop = [...coins, ...coins]

  return (
    <div className="relative overflow-hidden border-y border-border bg-card/40">
      <div className="flex w-max animate-[ticker_40s_linear_infinite] gap-8 py-2.5">
        {loop.map((coin, i) => {
          const up = coin.change24h >= 0
          return (
            <div key={`${coin.id}-${i}`} className="flex items-center gap-2 whitespace-nowrap px-2">
              <span className="font-mono text-xs font-semibold text-muted-foreground">{coin.symbol}</span>
              <span className="text-sm font-medium text-foreground">{formatUsd(coin.price)}</span>
              <span
                className={cn(
                  'flex items-center gap-0.5 text-xs font-medium',
                  up ? 'text-[var(--success)]' : 'text-destructive',
                )}
              >
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {formatPct(coin.change24h)}
              </span>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}

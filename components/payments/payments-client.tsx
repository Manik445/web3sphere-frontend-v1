'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Loader2,
  Send,
  ShieldCheck,
  Split,
  Users,
} from 'lucide-react'
import type { Coin } from '@/app/api/prices/route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetcher, formatUsd } from '@/lib/format'
import { cn } from '@/lib/utils'

type Mode = 'send' | 'request' | 'split'

const MODES: { id: Mode; label: string; icon: typeof Send }[] = [
  { id: 'send', label: 'Send', icon: Send },
  { id: 'request', label: 'Request', icon: ArrowDownLeft },
  { id: 'split', label: 'Split bill', icon: Split },
]

const FRIENDS = [
  { handle: 'vitalik', verified: true },
  { handle: 'anatoly', verified: true },
  { handle: 'gakonst', verified: true },
  { handle: 'punk6529', verified: false },
]

const ACTIVITY = [
  { dir: 'in', handle: 'anatoly', token: 'SOL', amount: 1.5, note: 'Hackathon prize split', time: '2m ago' },
  { dir: 'out', handle: 'vitalik', token: 'ETH', amount: 0.05, note: 'Lost the bet 😅', time: '1h ago' },
  { dir: 'in', handle: 'gakonst', token: 'ETH', amount: 0.2, note: 'Bounty payout', time: '5h ago' },
  { dir: 'out', handle: 'punk6529', token: 'USDC', amount: 40, note: 'Co-working desk', time: 'Yesterday' },
]

const TOKENS = ['ETH', 'BTC', 'SOL', 'BNB', 'USDC']

export function PaymentsClient() {
  const { data } = useSWR<{ coins: Coin[] }>('/api/prices', fetcher, { refreshInterval: 60_000 })
  const [mode, setMode] = useState<Mode>('send')
  const [token, setToken] = useState('ETH')
  const [amount, setAmount] = useState('0.05')
  const [recipient, setRecipient] = useState('')
  const [escrow, setEscrow] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const priceMap = useMemo(() => {
    const map: Record<string, number> = { USDC: 1 }
    for (const c of data?.coins ?? []) map[c.symbol] = c.price
    return map
  }, [data])

  const usdValue = (Number(amount) || 0) * (priceMap[token] ?? 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => setStatus('done'), 1200)
    setTimeout(() => setStatus('idle'), 3200)
  }

  const actionLabel = mode === 'send' ? 'Send now' : mode === 'request' ? 'Request now' : 'Split & request'

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* Payment composer */}
      <div className="rounded-3xl border border-border bg-card/60 p-6 glass md:p-8">
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-background/40 p-1.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                mode === m.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <m.icon className="h-4 w-4" />
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="recipient" className="font-mono text-[11px] uppercase tracking-widest">
              {mode === 'request' ? 'Request from' : 'Recipient'}
            </Label>
            <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <span className="font-mono text-sm text-muted-foreground">@</span>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                placeholder="username or wallet address"
                className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="font-mono text-[11px] uppercase tracking-widest">
              Amount
            </Label>
            <div className="rounded-xl border border-input bg-input/30 p-4">
              <div className="flex items-center gap-3">
                <input
                  id="amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="0.00"
                  aria-label="Amount"
                />
                <div className="flex flex-wrap justify-end gap-1">
                  {TOKENS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setToken(t)}
                      className={cn(
                        'rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-colors',
                        token === t
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/60 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                ≈ {formatUsd(usdValue)}
                {priceMap[token] ? (
                  <span className="ml-2 text-xs">
                    ({token} @ {formatUsd(priceMap[token])})
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          {/* Escrow toggle */}
          <button
            type="button"
            onClick={() => setEscrow((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-background/40 p-4 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex items-center gap-3">
              <ShieldCheck className={cn('h-5 w-5', escrow ? 'text-[var(--success)]' : 'text-muted-foreground')} />
              <span>
                <span className="block text-sm font-medium text-foreground">Escrow protection</span>
                <span className="block text-xs text-muted-foreground">Hold funds until work is confirmed</span>
              </span>
            </span>
            <span
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors',
                escrow ? 'bg-primary' : 'bg-secondary',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform',
                  escrow ? 'translate-x-[22px]' : 'translate-x-0.5',
                )}
              />
            </span>
          </button>

          <Button
            type="submit"
            disabled={status !== 'idle' || !recipient}
            className="h-12 w-full gap-2 rounded-full text-base"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Broadcasting transaction
              </>
            ) : status === 'done' ? (
              <>
                <Check className="h-4 w-4" />
                {mode === 'request' ? 'Request sent' : 'Transaction confirmed'}
              </>
            ) : (
              <>
                {actionLabel}
                <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Payments are tied to verified Web3Sphere identities — no more copy-pasting wallet addresses.
          </p>
        </form>
      </div>

      {/* Sidebar: friends + activity */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-card/60 p-6 glass">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Friends</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {FRIENDS.map((f) => (
              <button
                key={f.handle}
                type="button"
                onClick={() => setRecipient(f.handle)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50"
              >
                <span className="font-mono text-xs text-muted-foreground">@</span>
                {f.handle}
                {f.verified && <Check className="h-3 w-3 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/60 p-6 glass">
          <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
          <ul className="mt-4 space-y-3">
            {ACTIVITY.map((a, i) => {
              const incoming = a.dir === 'in'
              return (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      incoming ? 'bg-[var(--success)]/15 text-[var(--success)]' : 'bg-secondary text-muted-foreground',
                    )}
                  >
                    {incoming ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">
                      <span className="text-muted-foreground">@</span>
                      {a.handle}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{a.note}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-sm font-semibold', incoming ? 'text-[var(--success)]' : 'text-foreground')}>
                      {incoming ? '+' : '-'}
                      {a.amount} {a.token}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

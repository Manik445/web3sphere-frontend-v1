'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  Wallet,
  Trophy,
  Code2,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  X,
  Clock,
  Copy,
  ExternalLink,
  Users,
  Search,
  ArrowLeftRight,
  GraduationCap,
  MessagesSquare,
  Network,
  ShieldCheck,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { NetworkCanvas } from '@/components/network-canvas'
import { LinkedWalletsPanel } from '@/components/wallet/linked-wallets-panel'
import { cn } from '@/lib/utils'

const PROFILE = {
  avatar: '0x',
  name: 'satoshi.eth',
  wallet: '0x71C7…9f3E',
  score: 942,
  joined: 'Joined Mar 2023',
  stats: [
    { icon: Wallet, label: 'Net worth', value: '412K W3T' },
    { icon: Trophy, label: 'XP', value: '18,240' },
    { icon: Code2, label: 'Commits', value: '3.1K' },
    { icon: Network, label: 'Swarm rep', value: 'Top 2%' },
  ],
  badges: ['DAO Contributor', 'ETHGlobal Winner', 'Uniswap OG', 'Top 1% Q&A', 'Mentor', 'Verified Human'],
}

const FEATURES = [
  { icon: ArrowLeftRight, label: 'P2P Payments', desc: 'Send & request crypto', href: '/payments' },
  { icon: Users, label: 'Community Rooms', desc: 'Global & coin rooms', href: '/#community' },
  { icon: Search, label: 'Wallet Lookup', desc: 'Who is this wallet?', href: '/#identity' },
  { icon: Network, label: 'AI Swarm', desc: 'Predict the future', href: '/moats/predict-future' },
  { icon: GraduationCap, label: 'Mentorship', desc: 'Book top builders', href: '/#community' },
  { icon: MessagesSquare, label: 'Q&A Forum', desc: 'Earn tips & XP', href: '/#community' },
  { icon: Trophy, label: 'Hire / Get Hired', desc: 'Verified marketplace', href: '/hire' },
  { icon: ShieldCheck, label: 'Builder Score', desc: 'Your reputation', href: '/#moats' },
]

type Request = {
  id: number
  direction: 'incoming' | 'outgoing'
  counterparty: string
  amount: string
  usd: string
  note: string
  when: string
}

const INITIAL_REQUESTS: Request[] = [
  {
    id: 1,
    direction: 'incoming',
    counterparty: 'vitalik.eth',
    amount: '0.05 ETH',
    usd: '$168.40',
    note: 'Split for ETHGlobal booth',
    when: '12m ago',
  },
  {
    id: 2,
    direction: 'incoming',
    counterparty: 'ada.ai',
    amount: '250 USDC',
    usd: '$250.00',
    note: 'Design work — milestone 2',
    when: '1h ago',
  },
  {
    id: 3,
    direction: 'outgoing',
    counterparty: 'mert.sol',
    amount: '1.2 SOL',
    usd: '$214.80',
    note: 'Hackathon co-working',
    when: '3h ago',
  },
]

const HISTORY = [
  { id: 'tx1', type: 'received', counterparty: 'gakonst.eth', amount: '+0.8 ETH', usd: '$2,694', status: 'Completed', when: 'Apr 18' },
  { id: 'tx2', type: 'sent', counterparty: 'audit-dao', amount: '-500 USDC', usd: '$500', status: 'Completed', when: 'Apr 15' },
  { id: 'tx3', type: 'escrow', counterparty: 'ZK Labs', amount: '+3,000 USDC', usd: '$3,000', status: 'Released', when: 'Apr 11' },
  { id: 'tx4', type: 'received', counterparty: 'ada.ai', amount: '+250 USDC', usd: '$250', status: 'Completed', when: 'Apr 09' },
  { id: 'tx5', type: 'sent', counterparty: 'mentor.eth', amount: '-120 W3T', usd: '$96', status: 'Completed', when: 'Apr 02' },
  { id: 'tx6', type: 'escrow', counterparty: 'DeFiCo', amount: '+5,400 USDC', usd: '$5,400', status: 'Released', when: 'Mar 28' },
]

export function ProfileClient() {
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS)
  const [copied, setCopied] = useState(false)

  function resolve(id: number) {
    setRequests((r) => r.filter((req) => req.id !== id))
  }

  function copyWallet() {
    navigator.clipboard?.writeText('0x71C7656EC7ab88b098defB751B7401B5f6d8976F').catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const pendingCount = requests.length

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      {/* Identity header */}
      <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50">
          <NetworkCanvas density={34} />
          <div className="absolute right-[-6rem] top-[-6rem] h-64 w-64 rounded-full bg-primary/20 blur-[110px] animate-drift" />
        </div>
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[var(--chart-4)] font-mono text-2xl font-bold text-primary-foreground float-slow">
              {PROFILE.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-bold text-foreground">{PROFILE.name}</h1>
                <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
              </div>
              <button
                onClick={copyWallet}
                className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {PROFILE.wallet}
                {copied ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <p className="mt-1 text-xs text-muted-foreground">{PROFILE.joined}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-6 py-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Builder Score</p>
            <p className="text-4xl font-bold text-foreground">{PROFILE.score}</p>
            <p className="text-xs text-muted-foreground">Top 2% globally</p>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PROFILE.stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-background/50 p-4 text-center">
              <s.icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1.5 text-base font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          {PROFILE.badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {b}
            </span>
          ))}
        </div>
      </Reveal>

      {/* Feature quick-access */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Your Web3Sphere</h2>
        <p className="mt-1 text-sm text-muted-foreground">Everything available to you in one place.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal
              key={f.label}
              delay={(i % 4) * 70}
              as="div"
              className="h-full"
            >
              <Link
                href={f.href}
                className="group flex h-full items-start gap-3 rounded-2xl border border-border bg-card/40 p-4 transition-all hover:border-primary/40 hover:bg-card"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Transaction requests */}
        <section className="rounded-3xl border border-border bg-card/40 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Transaction requests</h2>
            </div>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {pendingCount} pending
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {requests.length === 0 && (
              <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                All caught up — no pending requests.
              </p>
            )}
            {requests.map((req) => (
              <div key={req.id} className="rounded-2xl border border-border bg-background/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full',
                        req.direction === 'incoming'
                          ? 'bg-[var(--success)]/15 text-[var(--success)]'
                          : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {req.direction === 'incoming' ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {req.direction === 'incoming' ? 'From' : 'To'} {req.counterparty}
                      </p>
                      <p className="text-xs text-muted-foreground">{req.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{req.amount}</p>
                    <p className="text-xs text-muted-foreground">{req.usd}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {req.when}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolve(req.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                      Decline
                    </button>
                    <button
                      onClick={() => resolve(req.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {req.direction === 'incoming' ? 'Pay' : 'Approve'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Completed history */}
        <section className="rounded-3xl border border-border bg-card/40 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Transaction history</h2>
            </div>
            <Link
              href="/payments"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 divide-y divide-border">
            {HISTORY.map((tx) => {
              const positive = tx.amount.trim().startsWith('+')
              return (
                <div key={tx.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full',
                        positive
                          ? 'bg-[var(--success)]/15 text-[var(--success)]'
                          : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {positive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.counterparty}</p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {tx.type} · {tx.when}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-sm font-bold',
                        positive ? 'text-[var(--success)]' : 'text-foreground',
                      )}
                    >
                      {tx.amount}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {tx.usd} · {tx.status}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
        {/* Linked Wallets Section */}
        <section className="mt-10">
          <LinkedWalletsPanel />
        </section>

      </div>
    </div>
  )
}

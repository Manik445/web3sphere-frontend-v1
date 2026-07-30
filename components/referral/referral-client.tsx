'use client'

import { useState } from 'react'
import {
  Copy,
  Check,
  Share2,
  Gift,
  Users,
  TrendingUp,
  DollarSign,
  Trophy,
  Zap,
  Star,
  ChevronRight,
  Sparkles,
  QrCode,
} from 'lucide-react'

const LEADERBOARD = [
  { rank: 1, name: 'vitalik.eth', avatar: 'VB', color: '#627EEA', referrals: 284, earned: '8,520 USDC' },
  { rank: 2, name: 'anatoly.sol', avatar: 'AS', color: '#9945FF', referrals: 201, earned: '6,030 USDC' },
  { rank: 3, name: 'hayd3n.base', avatar: 'HB', color: '#0052FF', referrals: 178, earned: '5,340 USDC' },
  { rank: 4, name: 'aria.eth', avatar: 'AE', color: '#FF007A', referrals: 142, earned: '4,260 USDC' },
  { rank: 5, name: 'marcus.zk', avatar: 'MZ', color: '#00D2FF', referrals: 119, earned: '3,570 USDC' },
  { rank: 6, name: 'priya.sol', avatar: 'PS', color: '#10A37F', referrals: 98, earned: '2,940 USDC' },
  { rank: 7, name: 'kenji.nft', avatar: 'KN', color: '#F3BA2F', referrals: 87, earned: '2,610 USDC' },
]

const MILESTONES = [
  { label: '1st Referral', reward: '$30 USDC', xp: 100, icon: '🎯', reached: true },
  { label: '5 Referrals', reward: '$150 USDC + NFT Badge', xp: 500, icon: '🔥', reached: true },
  { label: '10 Referrals', reward: '$300 USDC + Premium', xp: 1000, icon: '💎', reached: false },
  { label: '25 Referrals', reward: '$750 USDC + Top Builder', xp: 2500, icon: '👑', reached: false },
  { label: '50 Referrals', reward: '$1,500 USDC + DAO Access', xp: 5000, icon: '🌟', reached: false },
]

const REFERRED_USERS = [
  { name: 'dev_ankur', joined: '2 days ago', status: 'verified', reward: '$30 USDC' },
  { name: 'blockchain_jay', joined: '5 days ago', status: 'verified', reward: '$30 USDC' },
  { name: 'nft_creator99', joined: '1 week ago', status: 'pending', reward: 'Pending' },
  { name: 'defi_master.eth', joined: '2 weeks ago', status: 'verified', reward: '$30 USDC' },
]

function QRCodePlaceholder() {
  return (
    <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/40">
      <QrCode className="h-16 w-16 text-muted-foreground/40" />
    </div>
  )
}

export function ReferralClient() {
  const [copied, setCopied] = useState(false)
  const referralCode = 'WS-BUILDER-X9K2'
  const referralLink = `https://web3sphere.io/join?ref=${referralCode}`

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 animate-drift opacity-20" style={{ background: 'radial-gradient(ellipse 60% 40% at 70% 50%, oklch(0.72 0.16 235 / 15%), transparent)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, oklch(1 0 0 / 3%) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
                <Gift className="h-3.5 w-3.5" />
                Referral Program
              </span>
              <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                Invite builders.{' '}
                <span className="shimmer-text">Earn crypto.</span>
              </h1>
              <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                Earn $30 USDC for every builder you invite who verifies their account. Unlock NFT badges, premium access, and DAO governance at higher tiers.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <button className="rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg">
                  Start Inviting
                </button>
                <button className="flex items-center gap-2 rounded-2xl border border-border px-6 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Invited', value: '7', icon: Users, color: '#627EEA', sub: 'builders' },
                { label: 'Successful', value: '6', icon: Check, color: '#10A37F', sub: 'verified' },
                { label: 'Pending Rewards', value: '$30', icon: Zap, color: '#F3BA2F', sub: 'USDC' },
                { label: 'Total Earned', value: '$180', icon: DollarSign, color: '#9945FF', sub: 'USDC lifetime' },
              ].map(({ label, value, icon: Icon, color, sub }) => (
                <div key={label} className="rounded-2xl border border-border bg-card/40 p-5 transition-all hover:border-primary/30 hover:bg-card">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}20` }}>
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div className="mt-3 text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Referral Code + Link */}
      <section className="border-b border-border py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Code card */}
            <div className="rounded-2xl border border-border bg-card/40 p-6">
              <h3 className="text-sm font-semibold text-foreground">Your Referral Code</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 rounded-xl border border-border bg-secondary/30 px-4 py-3 font-mono text-lg font-bold tracking-widest text-foreground">
                  {referralCode}
                </div>
                <button onClick={() => handleCopy(referralCode)}
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary">
                  {copied ? <Check className="h-4 w-4 text-[var(--success)]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Share this code with builders to earn $30 USDC per verified referral.</p>
            </div>

            {/* Link + QR */}
            <div className="rounded-2xl border border-border bg-card/40 p-6">
              <h3 className="text-sm font-semibold text-foreground">Referral Link & QR Code</h3>
              <div className="mt-4 flex items-start gap-4">
                <QRCodePlaceholder />
                <div className="flex-1">
                  <div className="rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground break-all">{referralLink}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => handleCopy(referralLink)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card/60 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
                      <Copy className="h-3 w-3" /> Copy Link
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Share2 className="h-3 w-3" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="border-b border-border py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-xl font-bold text-foreground">
            <Sparkles className="mr-2 inline-block h-5 w-5 text-primary" />
            Referral Milestones
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Unlock bigger rewards as you invite more builders.</p>
          <div className="mt-6 space-y-3">
            {MILESTONES.map((m) => (
              <div key={m.label}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${m.reached ? 'border-[var(--success)]/30 bg-[var(--success)]/5' : 'border-border bg-card/30'}`}>
                <div className="text-2xl">{m.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{m.label}</span>
                    {m.reached && <span className="rounded-full bg-[var(--success)]/20 px-2 py-0.5 text-xs font-medium text-[var(--success)]">✓ Reached</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{m.reward} · {m.xp.toLocaleString()} XP</p>
                </div>
                <ChevronRight className={`h-4 w-4 ${m.reached ? 'text-[var(--success)]' : 'text-muted-foreground/40'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referred users + Leaderboard */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Referred users */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <Users className="mr-2 inline-block h-5 w-5 text-primary" />
                Your Invited Builders
              </h2>
              <div className="mt-4 space-y-3">
                {REFERRED_USERS.map((u) => (
                  <div key={u.name} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">Joined {u.joined}</p>
                    </div>
                    <div className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.status === 'verified' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[#F3BA2F]/10 text-[#F3BA2F]'}`}>
                      {u.status === 'verified' ? `✓ ${u.reward}` : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                <Trophy className="mr-2 inline-block h-5 w-5 text-primary" />
                Referral Leaderboard
              </h2>
              <div className="mt-4 space-y-2">
                {LEADERBOARD.map((entry) => (
                  <div key={entry.rank}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${entry.rank <= 3 ? 'border-primary/20 bg-primary/5' : 'border-border bg-card/30'}`}>
                    <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${entry.rank === 1 ? 'bg-[#F3BA2F] text-black' : entry.rank === 2 ? 'bg-muted text-foreground' : entry.rank === 3 ? 'bg-[#FF6C37]/20 text-[#FF6C37]' : 'bg-secondary text-muted-foreground'}`}>
                      {entry.rank}
                    </div>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: entry.color }}>
                      {entry.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.referrals} referrals</p>
                    </div>
                    <span className="text-xs font-semibold text-primary">{entry.earned}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

'use client'

import { BadgeCheck, Code2, Trophy, Wallet, Brain, FileText, Bot } from 'lucide-react'
import { useMode } from '@/components/mode-provider'

const CONTENT = {
  web3: {
    eyebrow: 'On-chain identity',
    title: 'The LinkedIn profile of the decentralized web',
    body: 'Every claim is verified on-chain. Turn anonymous wallets into human-readable reputations that travel with you across every platform.',
    points: [
      'On-chain resume: NFTs, POAPs, DAOs, and soulbound credentials.',
      'Wealth showcase converted to W3T, with zero-knowledge privacy toggles.',
      'A verifiable Builder Score that makes resumes obsolete.',
    ],
    profile: {
      avatar: '0x',
      name: 'satoshi.eth',
      meta: '0x71C7…9f3E · Builder Score 942',
      stats: [
        { icon: Wallet, label: 'Net worth', value: '412K W3T' },
        { icon: Trophy, label: 'XP', value: '18,240' },
        { icon: Code2, label: 'Commits', value: '3.1K' },
      ],
      badgesLabel: 'Achievements',
      badges: ['DAO Contributor', 'ETHGlobal Winner', 'Uniswap OG', 'Top 1% Q&A', 'Mentor'],
    },
  },
  ai: {
    eyebrow: 'AI builder identity',
    title: 'The professional profile for the AI era',
    body: 'Every model, dataset, and benchmark you ship becomes verifiable proof of work — a portable reputation that follows you across labs, teams, and platforms.',
    points: [
      'Verified portfolio: models, datasets, agents, and published papers.',
      'Benchmark-backed skills instead of self-reported resume claims.',
      'An AI Builder Score employers and collaborators can actually trust.',
    ],
    profile: {
      avatar: 'AI',
      name: 'ada.ai',
      meta: 'ada@lab · AI Builder Score 918',
      stats: [
        { icon: Bot, label: 'Agents', value: '27' },
        { icon: Trophy, label: 'XP', value: '21,540' },
        { icon: FileText, label: 'Papers', value: '14' },
      ],
      badgesLabel: 'Credentials',
      badges: ['NeurIPS Author', 'Top Prompt Eng', 'OSS Maintainer', 'Kaggle Master', 'Mentor'],
    },
  },
} as const

export function IdentityShowcase() {
  const { mode } = useMode()
  const c = CONTENT[mode]
  const p = c.profile

  return (
    <section id="identity" className="relative border-t border-border py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Brain className="h-3.5 w-3.5" />
            {c.eyebrow}
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {c.title}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{c.body}</p>
          <ul className="mt-6 space-y-3">
            {c.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm leading-relaxed text-foreground/90">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile card mockup */}
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
          <div className="relative rounded-3xl border border-border bg-card p-6 glass">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[var(--chart-4)] font-mono text-xl font-bold text-primary-foreground">
                {p.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-lg font-bold text-foreground">{p.name}</p>
                  <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
                </div>
                <p className="font-mono text-xs text-muted-foreground">{p.meta}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {p.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-background/50 p-3 text-center">
                  <stat.icon className="mx-auto h-4 w-4 text-primary" />
                  <p className="mt-1.5 text-sm font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {p.badgesLabel}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

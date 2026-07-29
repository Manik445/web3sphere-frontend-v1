'use client'

import Link from 'next/link'
import { ArrowRight, BadgeCheck, Briefcase, Clock, Code2, Coins, Flag, Star, ShieldCheck } from 'lucide-react'
import { useMode } from '@/components/mode-provider'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CONTENT = {
  web3: {
    eyebrow: 'Specialized marketplace',
    title: 'A freelance marketplace built only for Web3 & crypto',
    body: 'Unlike generic freelancing platforms, Web3Sphere is purpose-built for blockchain and fintech companies. Hire verified builders on an hourly, fixed-price, or milestone basis — with confidence.',
    roles: [
      'Smart Contract Engineers',
      'Solidity Auditors',
      'Security Researchers',
      'Protocol Designers',
      'DevOps Engineers',
      'Frontend Devs',
      'Product Managers',
      'Web3 Designers',
    ],
  },
  ai: {
    eyebrow: 'Specialized marketplace',
    title: 'A freelance marketplace built only for AI & ML teams',
    body: 'Unlike generic freelancing platforms, Web3Sphere is purpose-built for AI and fintech companies. Hire verified builders on an hourly, fixed-price, or milestone basis — with confidence.',
    roles: [
      'ML Engineers',
      'Research Scientists',
      'Data Engineers',
      'Prompt Engineers',
      'MLOps Engineers',
      'Agent Developers',
      'Product Managers',
      'AI Designers',
    ],
  },
} as const

const BASIS = [
  { icon: Clock, label: 'Hourly', desc: 'Flexible, tracked time' },
  { icon: Coins, label: 'Fixed-price', desc: 'Clear scope & budget' },
  { icon: Flag, label: 'Milestone', desc: 'Pay as work ships' },
]

const SIGNALS = [
  { icon: ShieldCheck, label: 'Verifiable Builder Score' },
  { icon: Code2, label: 'Live GitHub activity' },
  { icon: BadgeCheck, label: 'On-chain contributions' },
  { icon: Star, label: 'Hackathons & community rep' },
]

export function MarketplaceSection() {
  const { mode } = useMode()
  const c = CONTENT[mode]

  return (
    <section id="marketplace" className="relative border-t border-border py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
              <Briefcase className="h-3.5 w-3.5" />
              {c.eyebrow}
            </span>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {c.title}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{c.body}</p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {BASIS.map((b) => (
                <div key={b.label} className="rounded-xl border border-border bg-card/40 p-4">
                  <b.icon className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-sm font-semibold text-foreground">{b.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/hire" className={cn(buttonVariants(), 'h-11 gap-2 rounded-full px-5')}>
                Explore the marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/hire/post"
                className={cn(buttonVariants({ variant: 'outline' }), 'h-11 rounded-full px-5')}
              >
                Post a project
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/60 p-6 glass md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Hire verified talent
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm text-foreground"
                >
                  {role}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-foreground">
                Every profile is backed by proof, not promises
              </p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {SIGNALS.map((s) => (
                  <li key={s.label} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-foreground/90">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

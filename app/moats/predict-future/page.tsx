import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  GitBranch,
  Gauge,
  Timer,
  FileText,
  Archive,
  Sparkles,
  Users,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { SwarmSimulation } from '@/components/moats/swarm-simulation'
import { SupportChat } from '@/components/support-chat'
import { buttonVariants } from '@/components/ui/button'
import { getMoat } from '@/lib/moats'
import { cn } from '@/lib/utils'

const moat = getMoat('predict-future')!

export const metadata: Metadata = {
  title: 'Moat 01 — Predict Future | Web3Sphere',
  description:
    'AI swarm intelligence on live debates. Every debate spawns thousands of AI agents while real users join as reputation-weighted nodes — producing emergent, on-chain verifiable predictions.',
}

const HOW_IT_WORKS = [
  {
    icon: Bot,
    title: 'A debate spawns a swarm',
    desc: 'Every open topic triggers thousands of AI agents powered by MiroFish, each with distinct viewpoints, memories, and personalities.',
  },
  {
    icon: Users,
    title: 'Real users become nodes',
    desc: 'You attach directly to the agent graph. Your arguments shift agent sentiment in real time — visible as moving edges on the live canvas.',
  },
  {
    icon: Gauge,
    title: 'Reputation weights influence',
    desc: 'Your Builder Score sets your pull. A score-900 expert moves consensus far more than a score-100 newcomer.',
  },
  {
    icon: Timer,
    title: 'The timer closes the round',
    desc: 'When time runs out, emergent swarm behaviour is frozen and analysed — not a single AI opinion, but the whole crowd.',
  },
  {
    icon: FileText,
    title: 'A structured report is generated',
    desc: 'Likely futures, key risks, ripple effects, and a confidence score — all sourced from the swarm.',
  },
  {
    icon: Archive,
    title: 'It becomes an on-chain asset',
    desc: 'Each simulation is permanently archived as a timestamped, verifiable record protocols and VCs pay to access.',
  },
]

const REPORT = {
  question: 'Will an ETH L2 flip Ethereum mainnet in daily active users within 18 months?',
  confidence: 74,
  futures: [
    { label: 'Most likely', value: 'A single L2 crosses mainnet DAU as fees stay near zero', pct: 74 },
    { label: 'Plausible', value: 'Fragmented L2 landscape keeps mainnet ahead on DAU', pct: 19 },
    { label: 'Tail risk', value: 'A non-EVM chain absorbs the growth instead', pct: 7 },
  ],
  risks: ['Sequencer centralization backlash', 'Fee-market regime change', 'Bridge security incident'],
}

export default function PredictFuturePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-8rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px] animate-drift" />
            <div
              className="absolute inset-0 opacity-[0.05] animate-grid-pan"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 md:px-6 md:pb-20 md:pt-16">
            <Link
              href="/#moats"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All moats
            </Link>

            <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-6xl font-bold text-primary/25">{moat.number}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Moat 01
                  </span>
                </div>
                <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Predict Future: <span className="shimmer-text">AI swarm intelligence</span> on live debates
                </h1>
                <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  {moat.summary}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/signup"
                    className={cn(buttonVariants(), 'h-12 gap-2 rounded-full px-7 text-base transition-transform hover:-translate-y-0.5')}
                  >
                    Join a live swarm
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#how"
                    className={cn(buttonVariants({ variant: 'outline' }), 'h-12 rounded-full px-7 text-base')}
                  >
                    How it works
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <SwarmSimulation />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Key differentiators */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <Reveal className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">Why it&apos;s defensible</span>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Community debate + AI simulation + reputation-weighted influence — in one experience
              </h2>
              <p className="mt-3 text-pretty text-muted-foreground">
                No other builder platform, DAO tool, or forecasting product combines all three. The prediction engine
                gets smarter the more our builder community engages — a moat competitors can&apos;t replicate without
                our network.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {moat.points.map((point, i) => (
                <Reveal
                  key={i}
                  delay={(i % 2) * 90}
                  className="flex gap-4 rounded-2xl border border-border bg-card/40 p-6"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{point}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
                <GitBranch className="h-3.5 w-3.5" />
                The pipeline
              </span>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                From a single question to a verifiable prediction
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {HOW_IT_WORKS.map((step, i) => (
                <Reveal
                  key={step.title}
                  delay={(i % 3) * 90}
                  className="group h-full rounded-2xl border border-border bg-card/40 p-6 transition-all hover:border-primary/40 hover:bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      STEP {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Prediction report mockup */}
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <Reveal className="mb-8 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">Auto-generated output</span>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                The prediction report
              </h2>
            </Reveal>

            <Reveal className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Simulation #4821 · archived on-chain
                </p>
                <span className="rounded-full border border-[var(--success)]/40 bg-[var(--success)]/10 px-3 py-1 text-xs font-semibold text-[var(--success)]">
                  Confidence {REPORT.confidence}%
                </span>
              </div>

              <div className="px-6 py-6">
                <p className="text-sm text-muted-foreground">Question</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{REPORT.question}</p>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Likely futures
                </p>
                <div className="mt-3 space-y-3">
                  {REPORT.futures.map((f) => (
                    <div key={f.label} className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-foreground">{f.label}</span>
                        <span className="font-mono text-sm text-primary">{f.pct}%</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{f.value}</p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${f.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Key risks &amp; ripple effects
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {REPORT.risks.map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center md:p-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-[100px] animate-drift"
              />
              <div className="relative">
                <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Turn the crowd into a prediction engine
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
                  Join a live swarm, lend your Builder Score to the debate, and help produce the intelligence assets the
                  Web3 world relies on.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/signup"
                    className={cn(buttonVariants(), 'h-12 gap-2 rounded-full px-7 text-base')}
                  >
                    Claim your identity
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/#moats"
                    className={cn(buttonVariants({ variant: 'outline' }), 'h-12 rounded-full px-7 text-base')}
                  >
                    Explore other moats
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <SupportChat />
    </div>
  )
}

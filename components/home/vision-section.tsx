import { TrendingUp, Layers } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { REVENUE_STREAMS } from '@/lib/moats'

const METRICS = [
  { value: '$450B', label: 'Global freelance market today' },
  { value: '40%+', label: 'Annual growth in Web3 & AI talent' },
  { value: '$2B+', label: 'Revenue at just 1% market capture' },
  { value: '5', label: 'Independent revenue streams' },
]

export function VisionSection() {
  return (
    <section id="vision" className="relative overflow-hidden border-t border-border py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/2 top-10 h-80 w-80 translate-x-1/2 rounded-full bg-primary/10 blur-[120px] animate-drift"
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
            The opportunity
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why this becomes a $1B+ company
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Web3Sphere doesn&apos;t need to win the whole market. Capturing just 1% of the Web3 developer economy
            at maturity is a $2B+ revenue business — and any one of our five revenue streams could be venture-scale
            on its own.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal
              key={m.label}
              delay={i * 90}
              className="rounded-2xl border border-border bg-card/50 p-6 text-center glass transition-colors hover:border-primary/40"
            >
              <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{m.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.label}</p>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={120}
          className="mt-8 overflow-hidden rounded-3xl border border-border bg-card/40 p-8 md:p-10"
        >
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Layers className="h-4 w-4 text-primary" />
            Five independent revenue streams
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {REVENUE_STREAMS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-background/50 p-4">
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 border-l-2 border-primary pl-4 text-pretty text-base italic leading-relaxed text-foreground/90 md:text-lg">
            &ldquo;Just as AWS became the infrastructure layer for software companies, Web3Sphere becomes the
            workforce infrastructure layer for the entire decentralised economy — hiring, building, and paying the
            people who build the future of the internet.&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  )
}

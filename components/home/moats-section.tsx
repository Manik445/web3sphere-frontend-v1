import Link from 'next/link'
import { ArrowUpRight, ShieldCheck, Network } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { NetworkCanvas } from '@/components/network-canvas'
import { MOATS } from '@/lib/moats'

export function MoatsSection() {
  const featured = MOATS[0]
  const rest = MOATS.slice(1)

  return (
    <section id="moats" className="relative border-t border-border py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Our moats
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Eight defensible advantages competitors can&apos;t copy
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Each moat compounds with scale — reputation data, network effects, and proprietary intelligence that get
            stronger the longer the platform runs.
          </p>
        </Reveal>

        {/* Featured Moat 01 */}
        <Reveal className="mt-14">
          <Link
            href="/moats/predict-future"
            className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/50 md:p-10"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
              <NetworkCanvas density={40} />
              <div className="absolute right-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-primary/20 blur-[110px] animate-drift" />
            </div>
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-5xl font-bold text-primary/30">{featured.number}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Network className="h-3.5 w-3.5" />
                    Featured moat
                  </span>
                </div>
                <h3 className="mt-4 text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {featured.title} — {featured.tagline}
                </h3>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{featured.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Explore the swarm intelligence engine
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Remaining moats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((moat, i) => (
            <Reveal
              key={moat.id}
              delay={(i % 3) * 90}
              className="group h-full rounded-2xl border border-border bg-card/40 p-6 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-2xl font-bold text-primary/25">{moat.number}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">{moat.title}</h3>
              <p className="mt-1 text-sm font-medium text-primary/90">{moat.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{moat.summary}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

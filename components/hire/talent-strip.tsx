import Link from 'next/link'
import { BadgeCheck, ShieldCheck, Star } from 'lucide-react'
import { formatUsd } from '@/lib/format'
import { freelancers } from '@/lib/hire-data'

export function TalentStrip() {
  return (
    <section className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary">Verified talent</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Top builders</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Every profile is backed by a verifiable Builder Score, on-chain activity, and community reputation.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {freelancers.map((f) => (
            <Link
              key={f.id}
              href={`/hire/freelancers/${f.id}`}
              className="group rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40 hover:bg-card/70"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                  {f.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                      {f.name}
                    </span>
                    {f.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{f.title}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Score
                </span>
                <span className="text-sm font-semibold text-foreground">{f.builderScore}</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{formatUsd(f.hourlyRate)}/hr</span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-primary" />
                  {f.rating.toFixed(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

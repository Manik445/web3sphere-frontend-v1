import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Boxes,
  GitBranch,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCompact, formatUsd } from '@/lib/format'
import { freelancers, getFreelancer } from '@/lib/hire-data'

export function generateStaticParams() {
  return freelancers.map((f) => ({ id: f.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const f = getFreelancer(id)
  if (!f) return { title: 'Builder not found · Web3Sphere' }
  return { title: `${f.name} · Web3Sphere`, description: f.title }
}

export default async function FreelancerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const f = getFreelancer(id)
  if (!f) notFound()

  const scorePct = Math.min(100, Math.round((f.builderScore / 900) * 100))

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
          <Link
            href="/hire"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main */}
            <div>
              <div className="rounded-3xl border border-border bg-card/50 p-6 glass md:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-xl font-bold text-primary">
                    {f.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{f.name}</h1>
                      {f.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-muted-foreground">{f.title}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="font-mono">@{f.handle}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {f.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-foreground">
                        <Star className="h-4 w-4 text-primary" />
                        {f.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{f.about}</p>
              </div>

              {/* Proof signals */}
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">Proof of work</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Signal icon={GitBranch} label="GitHub commits" value={formatCompact(f.githubCommits)} />
                  <Signal icon={Boxes} label="On-chain contribs" value={String(f.onChainContribs)} />
                  <Signal icon={Award} label="Hackathon wins" value={String(f.hackathonWins)} />
                  <Signal icon={ShieldCheck} label="Jobs completed" value={String(f.jobsCompleted)} />
                </div>
              </section>

              {/* Skills */}
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {f.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-2xl border border-border bg-card/60 p-5 glass">
                {/* Builder Score */}
                <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Builder Score
                    </span>
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-foreground text-glow">{f.builderScore}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${scorePct}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Verifiable, aggregated from on-chain and community activity.
                  </p>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Hourly rate" value={`${formatUsd(f.hourlyRate)}/hr`} />
                  <Row label="Total earned" value={formatUsd(f.earned)} />
                  <Row label="Availability" value={f.availability} />
                </dl>

                <Link
                  href="/payments"
                  className={cn(buttonVariants(), 'mt-5 h-11 w-full')}
                >
                  Invite to a project
                </Link>
                <Link
                  href="/hire"
                  className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 h-11 w-full')}
                >
                  Message
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Signal({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GitBranch
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}

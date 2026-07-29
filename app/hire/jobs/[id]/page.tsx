import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  Clock,
  Coins,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BidPanel } from '@/components/hire/bid-panel'
import { formatUsd } from '@/lib/format'
import { BASIS_LABEL, getCompany, getJob, jobs } from '@/lib/hire-data'

export function generateStaticParams() {
  return jobs.map((j) => ({ id: j.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const job = getJob(id)
  if (!job) return { title: 'Job not found · Web3Sphere' }
  return {
    title: `${job.title} · Web3Sphere`,
    description: job.summary,
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = getJob(id)
  if (!job) notFound()
  const company = getCompany(job.companyId)

  const rate = job.basis === 'hourly' ? `${formatUsd(job.budget)}/hr` : formatUsd(job.budget)

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

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Main */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {job.category}
                </span>
                <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground/80">
                  {BASIS_LABEL[job.basis]}
                </span>
                <span className="text-xs text-muted-foreground">Posted {job.postedAt}</span>
              </div>

              <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {job.title}
              </h1>

              {/* Company row */}
              <Link
                href={`/hire/companies/${job.companyId}`}
                className="mt-4 inline-flex items-center gap-3 rounded-xl border border-border bg-card/40 px-4 py-3 transition-colors hover:border-primary/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-foreground">
                  {company?.logoInitials}
                </span>
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {company?.name}
                    {company?.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  </span>
                  <span className="text-xs text-muted-foreground">{company?.tagline}</span>
                </span>
              </Link>

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat icon={Coins} label="Budget" value={rate} />
                <Stat icon={Clock} label="Duration" value={job.duration} />
                <Stat icon={Users} label="Bids" value={String(job.proposals)} />
                <Stat icon={ShieldCheck} label="Min score" value={`${job.minBuilderScore}+`} />
              </div>

              {/* Description */}
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">Overview</h2>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{job.description}</p>
              </section>

              <section className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">What you&apos;ll do</h2>
                <ul className="mt-3 space-y-2.5">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Skills */}
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">Required skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              {/* Milestones / escrow */}
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">
                  {job.basis === 'hourly' ? 'Payment' : 'Milestones & escrow'}
                </h2>
                <div className="mt-3 space-y-2.5">
                  {job.milestones.map((m, i) => (
                    <div
                      key={m.title}
                      className="flex items-center justify-between rounded-xl border border-border bg-card/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-foreground">
                          {i + 1}
                        </span>
                        <span className="text-sm text-foreground">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground">{formatUsd(m.amount)}</span>
                        <span
                          className={
                            m.status === 'active'
                              ? 'rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary'
                              : 'rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground'
                          }
                        >
                          {m.status === 'active' ? 'In escrow' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Workflow */}
              <section className="mt-8 rounded-2xl border border-border bg-card/40 p-5">
                <h2 className="text-sm font-semibold text-foreground">How you&apos;ll work together</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <WorkflowItem icon={ClipboardList} title="Tickets" tools="ClickUp / GitHub" />
                  <WorkflowItem icon={CalendarClock} title="Meetings" tools="Slack / Calendly" />
                  <WorkflowItem icon={ShieldCheck} title="Payouts" tools="Escrow milestones" />
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <BidPanel job={job} />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Coins
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function WorkflowItem({
  icon: Icon,
  title,
  tools,
}: {
  icon: typeof Coins
  title: string
  tools: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{tools}</span>
      </span>
    </div>
  )
}

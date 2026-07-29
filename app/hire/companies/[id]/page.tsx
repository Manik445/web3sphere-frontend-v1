import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BadgeCheck, Globe, MapPin, Star, Users } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { JobCard } from '@/components/hire/job-card'
import { formatUsd } from '@/lib/format'
import { companies, getCompany, getCompanyJobs } from '@/lib/hire-data'

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const company = getCompany(id)
  if (!company) return { title: 'Company not found · Web3Sphere' }
  return { title: `${company.name} · Web3Sphere`, description: company.tagline }
}

export default async function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = getCompany(id)
  if (!company) notFound()
  const openJobs = getCompanyJobs(company.id)

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

          {/* Header card */}
          <div className="mt-6 rounded-3xl border border-border bg-card/50 p-6 glass md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xl font-bold text-foreground">
                {company.logoInitials}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{company.name}</h1>
                  {company.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-pretty text-muted-foreground">{company.tagline}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="h-4 w-4" />
                    {company.website}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {company.size} people
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <Star className="h-4 w-4 text-primary" />
                    {company.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Total spent" value={formatUsd(company.totalSpent)} />
              <Metric label="Hires" value={String(company.hires)} />
              <Metric label="Founded" value={company.founded} />
              <Metric label="Open roles" value={String(openJobs.length)} />
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              <section>
                <h2 className="text-lg font-semibold text-foreground">About</h2>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{company.about}</p>
              </section>

              <section className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">
                  Open roles ({openJobs.length})
                </h2>
                {openJobs.length > 0 ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {openJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">No open roles right now.</p>
                )}
              </section>
            </div>

            <aside className="lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-2xl border border-border bg-card/50 p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Tech stack</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-4">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}

import Link from 'next/link'
import { BadgeCheck, Clock, MapPin, ShieldCheck, Users } from 'lucide-react'
import { formatUsd } from '@/lib/format'
import { BASIS_LABEL, getCompany, type Job } from '@/lib/hire-data'

export function JobCard({ job }: { job: Job }) {
  const company = getCompany(job.companyId)
  const rate = job.basis === 'hourly' ? `${formatUsd(job.budget)}/hr` : formatUsd(job.budget)

  return (
    <Link
      href={`/hire/jobs/${job.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40 hover:bg-card/70"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-foreground">
            {company?.logoInitials}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-foreground">{company?.name}</span>
              {company?.verified && <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified company" />}
            </div>
            <span className="text-xs text-muted-foreground">{job.postedAt}</span>
          </div>
        </div>
        <span className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[11px] font-medium text-foreground/80">
          {BASIS_LABEL[job.basis]}
        </span>
      </div>

      <h3 className="mt-4 text-pretty text-base font-semibold leading-snug text-foreground group-hover:text-primary">
        {job.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{job.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-xs text-foreground/80"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="text-sm font-semibold text-foreground">
          {rate} <span className="font-normal text-muted-foreground">{job.currency}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {job.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {job.proposals} bids
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Score {job.minBuilderScore}+
        </span>
      </div>
    </Link>
  )
}

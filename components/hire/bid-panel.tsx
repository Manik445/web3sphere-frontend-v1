'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Loader2, Lock, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { formatUsd } from '@/lib/format'
import { BASIS_LABEL, checkBidEligibility, currentUser, type Job } from '@/lib/hire-data'

export function BidPanel({ job }: { job: Job }) {
  const elig = checkBidEligibility(job, currentUser)
  const [amount, setAmount] = useState(String(job.budget))
  const [duration, setDuration] = useState('')
  const [cover, setCover] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!elig.eligible || status === 'loading') return
    setStatus('loading')
    setTimeout(() => setStatus('done'), 1100)
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 glass md:p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Submit a bid</span>
        <span className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[11px] font-medium text-foreground/80">
          {BASIS_LABEL[job.basis]}
        </span>
      </div>

      {/* Eligibility checklist */}
      <div className="mt-4 rounded-xl border border-border bg-background/50 p-4">
        <p className="text-sm font-semibold text-foreground">Bid eligibility</p>
        <ul className="mt-3 space-y-2.5">
          <EligRow
            ok={elig.verifiedOk}
            label="Verified identity"
            detail={elig.verifiedOk ? 'Your identity is verified' : 'Verify your identity to bid'}
          />
          <EligRow
            ok={elig.scoreOk}
            label={`Builder Score ${job.minBuilderScore}+`}
            detail={`Your score is ${currentUser.builderScore}`}
          />
          <EligRow
            ok={elig.skillOk}
            label="Relevant experience"
            detail={
              elig.matchedSkills.length > 0
                ? `Matched: ${elig.matchedSkills.join(', ')}`
                : `No matching skills for ${job.skills.join(', ')}`
            }
          />
        </ul>

        {!elig.eligible && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-xs leading-relaxed text-foreground/90">
              Bidding is locked. Only trusted builders who meet the Builder Score threshold and have relevant
              experience can bid on this role.
              {elig.missingSkills.length > 0 && !elig.skillOk && (
                <> Add proven experience in {job.skills.join(', ')} to unlock.</>
              )}
            </p>
          </div>
        )}
      </div>

      {status === 'done' ? (
        <div className="mt-4 flex flex-col items-center rounded-xl border border-[color-mix(in_oklch,var(--success)_35%,transparent)] bg-[color-mix(in_oklch,var(--success)_12%,transparent)] p-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--success)_20%,transparent)] text-[var(--success)]">
            <Check className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-foreground">Bid submitted</p>
          <p className="mt-1 text-xs text-muted-foreground">
            The company will review your proposal and reach out via the shared workspace.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className={cn('mt-4 space-y-4', !elig.eligible && 'pointer-events-none opacity-50')}>
          <div className="space-y-1.5">
            <Label htmlFor="bid-amount">Your rate ({job.currency})</Label>
            <Input
              id="bid-amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!elig.eligible}
            />
            <p className="text-[11px] text-muted-foreground">
              {job.basis === 'hourly' ? 'Proposed hourly rate' : 'Total for the engagement'} · client budget{' '}
              {job.basis === 'hourly' ? `${formatUsd(job.budget)}/hr` : formatUsd(job.budget)}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bid-duration">Estimated timeline</Label>
            <Input
              id="bid-duration"
              placeholder="e.g. 6 weeks"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={!elig.eligible}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bid-cover">Cover note</Label>
            <textarea
              id="bid-cover"
              rows={4}
              placeholder="Briefly explain your relevant experience and approach."
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              disabled={!elig.eligible}
              className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
            />
          </div>

          <Button type="submit" disabled={!elig.eligible || status === 'loading'} className="h-11 w-full gap-2">
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Submit bid
              </>
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Funds are held in escrow and released per milestone.{' '}
            <Link href="/payments" className="text-primary hover:underline">
              How escrow works
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}

function EligRow({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
          ok
            ? 'bg-[color-mix(in_oklch,var(--success)_20%,transparent)] text-[var(--success)]'
            : 'bg-destructive/15 text-destructive',
        )}
      >
        {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </span>
      <span className="text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="block text-muted-foreground">{detail}</span>
      </span>
    </li>
  )
}

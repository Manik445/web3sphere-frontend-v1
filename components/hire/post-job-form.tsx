'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { BASIS_LABEL, CATEGORIES, type Basis } from '@/lib/hire-data'

const BASIS_OPTIONS = Object.keys(BASIS_LABEL) as Basis[]

export function PostJobForm() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [basis, setBasis] = useState<Basis>('milestone')
  const [budget, setBudget] = useState('')
  const [minScore, setMinScore] = useState('600')
  const [duration, setDuration] = useState('')
  const [description, setDescription] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills((p) => [...p, s])
    setSkillInput('')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setTimeout(() => setStatus('done'), 1100)
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-border bg-card/50 p-10 text-center glass">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--success)_20%,transparent)] text-[var(--success)]">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-foreground">Your project is live</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Verified builders with relevant experience can now bid. You&apos;ll review proposals, assign tickets, and
          release milestone payments through escrow from your workspace.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/hire" className={cn('inline-flex')}>
            <Button className="h-11 px-5">Back to marketplace</Button>
          </Link>
          <Button variant="outline" className="h-11 px-5" onClick={() => setStatus('idle')}>
            Post another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6 rounded-3xl border border-border bg-card/40 p-6 md:p-8">
        <div className="space-y-1.5">
          <Label htmlFor="job-title">Project title</Label>
          <Input
            id="job-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build an ERC-4626 yield vault"
            className="h-11"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="job-category">Category</Label>
            <select
              id="job-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
              className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Engagement basis</Label>
            <div className="flex gap-2">
              {BASIS_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBasis(b)}
                  aria-pressed={basis === b}
                  className={cn(
                    'flex-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors',
                    basis === b
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  {BASIS_LABEL[b]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="job-budget">{basis === 'hourly' ? 'Hourly rate (USDC)' : 'Budget (USDC)'}</Label>
            <Input
              id="job-budget"
              required
              inputMode="decimal"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={basis === 'hourly' ? '85' : '40000'}
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-duration">Duration</Label>
            <Input
              id="job-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="6-8 weeks"
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job-score">Min Builder Score</Label>
            <Input
              id="job-score"
              inputMode="numeric"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              placeholder="600"
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="job-skill">Required skills</Label>
          <div className="flex gap-2">
            <Input
              id="job-skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="Type a skill and press Enter"
              className="h-11"
            />
            <Button type="button" variant="outline" onClick={addSkill} className="h-11 shrink-0 gap-1 px-4">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1 text-sm text-foreground"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => setSkills((p) => p.filter((x) => x !== s))}
                    aria-label={`Remove ${s}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">
            Builders must match at least one required skill to be allowed to bid.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="job-desc">Description</Label>
          <textarea
            id="job-desc"
            rows={6}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the scope, deliverables, and how you'll collaborate (tickets, meetings, milestones)."
            className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Aside summary */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-border bg-card/60 p-5 glass">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Trust & escrow</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-3 w-3" />
              </span>
              Only verified builders who meet your Builder Score threshold and skills can bid.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-3 w-3" />
              </span>
              Assign tickets via ClickUp, GitHub, or Jira in a shared workspace.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-3 w-3" />
              </span>
              Funds sit in escrow and release automatically as milestones are approved.
            </li>
          </ul>

          <Button type="submit" disabled={status === 'loading'} className="mt-6 h-11 w-full gap-2">
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing…
              </>
            ) : (
              'Publish project'
            )}
          </Button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">Demo form — nothing is stored.</p>
        </div>
      </aside>
    </form>
  )
}

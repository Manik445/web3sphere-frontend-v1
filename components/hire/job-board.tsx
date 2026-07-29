'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { JobCard } from '@/components/hire/job-card'
import { BASIS_LABEL, CATEGORIES, jobs, type Basis, type JobCategory } from '@/lib/hire-data'

type BasisFilter = Basis | 'all'
type CategoryFilter = JobCategory | 'all'

const SORTS = [
  { id: 'recent', label: 'Most recent' },
  { id: 'budget', label: 'Highest budget' },
  { id: 'bids', label: 'Fewest bids' },
] as const

type SortId = (typeof SORTS)[number]['id']

export function JobBoard() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [basis, setBasis] = useState<BasisFilter>('all')
  const [sort, setSort] = useState<SortId>('recent')

  const filtered = useMemo(() => {
    let list = jobs.filter((j) => {
      const matchesQuery =
        query.trim() === '' ||
        j.title.toLowerCase().includes(query.toLowerCase()) ||
        j.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
      const matchesCategory = category === 'all' || j.category === category
      const matchesBasis = basis === 'all' || j.basis === basis
      return matchesQuery && matchesCategory && matchesBasis
    })

    list = [...list].sort((a, b) => {
      if (sort === 'budget') return b.budget - a.budget
      if (sort === 'bids') return a.proposals - b.proposals
      return 0 // recent: keep source order
    })

    return list
  }, [query, category, basis, sort])

  return (
    <section id="board" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary">Open work</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Listed projects & roles
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <label htmlFor="sort" className="sr-only">
            Sort jobs
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="rounded-lg border border-border bg-card/60 px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or skill (e.g. Solidity, RAG, audit)"
          className="h-12 rounded-xl pl-10"
          aria-label="Search jobs"
        />
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
          All categories
        </FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </FilterChip>
        ))}
      </div>

      {/* Basis chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip active={basis === 'all'} onClick={() => setBasis('all')} subtle>
          Any basis
        </FilterChip>
        {(Object.keys(BASIS_LABEL) as Basis[]).map((b) => (
          <FilterChip key={b} active={basis === b} onClick={() => setBasis(b)} subtle>
            {BASIS_LABEL[b]}
          </FilterChip>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center">
          <p className="text-sm text-muted-foreground">No roles match your filters. Try broadening your search.</p>
        </div>
      )}
    </section>
  )
}

function FilterChip({
  active,
  subtle,
  onClick,
  children,
}: {
  active: boolean
  subtle?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : subtle
            ? 'border-border bg-transparent text-muted-foreground hover:text-foreground'
            : 'border-border bg-card/50 text-foreground/80 hover:border-primary/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

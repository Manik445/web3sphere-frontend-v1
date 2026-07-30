'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Award,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Coins,
  Crown,
  FileVideo,
  Filter,
  GraduationCap,
  Lock,
  Play,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Trophy,
  UploadCloud,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Tab = 'explore' | 'upload' | 'my-learning'

type Category =
  | 'Smart Contracts'
  | 'ZK Proofs'
  | 'AI Agents'
  | 'DeFi'
  | 'Solana'
  | 'Ethereum'
  | 'Security'
  | 'Product'

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

interface Course {
  id: string
  title: string
  subtitle: string
  instructor: string
  instructorScore: number
  category: Category
  difficulty: Difficulty
  priceUSD: number
  priceW3T: number
  duration: string
  lessons: number
  rating: number
  reviews: number
  enrolled: number
  imageColor: string
  tags: string[]
  badge: {
    name: string
    xp: number
    builderScore: number
  }
  chapters: { title: string; lessons: { title: string; duration: string }[] }[]
  isMine?: boolean
  progress?: number
}

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Smart Contracts',
  'ZK Proofs',
  'AI Agents',
  'DeFi',
  'Solana',
  'Ethereum',
  'Security',
  'Product',
]

const COURSES: Course[] = [
  {
    id: 'sol-shenanigans',
    title: 'Solana Program Development 201',
    subtitle: 'Build production-grade on-chain programs with Rust + Anchor — ship your own AMM in week 4.',
    instructor: 'anatoly.sol',
    instructorScore: 940,
    category: 'Solana',
    difficulty: 'Advanced',
    priceUSD: 199,
    priceW3T: 890,
    duration: '12h 40m',
    lessons: 48,
    rating: 4.9,
    reviews: 1240,
    enrolled: 8420,
    imageColor: '#9945FF',
    tags: ['Rust', 'Anchor', 'CPI', 'PDAs'],
    badge: { name: 'Solana Expert', xp: 1800, builderScore: 25 },
    chapters: [
      {
        title: 'Foundations: Accounts & PDAs',
        lessons: [
          { title: 'Solana account model deep dive', duration: '28m' },
          { title: 'Program Derived Addresses in practice', duration: '34m' },
          { title: 'Building a simple vault program', duration: '42m' },
        ],
      },
      {
        title: 'Anchor Framework',
        lessons: [
          { title: 'Idl, Accounts, and instruction flow', duration: '36m' },
          { title: 'Error handling & security practices', duration: '29m' },
          { title: 'Testing with TypeScript & banks', duration: '48m' },
        ],
      },
      {
        title: 'Capstone: Build an AMM',
        lessons: [
          { title: 'Liquidity pool math', duration: '22m' },
          { title: 'Swap, add / remove liquidity', duration: '64m' },
          { title: 'Final audit & deploy', duration: '40m' },
        ],
      },
    ],
  },
  {
    id: 'zk-starter',
    title: 'Zero-Knowledge Proofs: From Zero to Circuits',
    subtitle: 'Groth16, Plonk, Halo2, and Noir. Build a ZK voting app end-to-end.',
    instructor: 'zkblake.dev',
    instructorScore: 912,
    category: 'ZK Proofs',
    difficulty: 'Intermediate',
    priceUSD: 249,
    priceW3T: 1120,
    duration: '16h 10m',
    lessons: 62,
    rating: 4.8,
    reviews: 860,
    enrolled: 5140,
    imageColor: '#00D2FF',
    tags: ['Circom', 'Noir', 'Halo2', 'Groth16'],
    badge: { name: 'ZK Practitioner', xp: 2400, builderScore: 35 },
    chapters: [
      {
        title: 'Math & Cryptography',
        lessons: [
          { title: 'Finite fields & polynomials', duration: '30m' },
          { title: 'Commitments & R1CS', duration: '44m' },
          { title: 'Trusted setups explained', duration: '28m' },
        ],
      },
      {
        title: 'Circom 2.0 in Practice',
        lessons: [
          { title: 'Witness generation & templates', duration: '38m' },
          { title: 'Reusable circuit libraries', duration: '32m' },
        ],
      },
      {
        title: 'Capstone: ZK Voting',
        lessons: [
          { title: 'Anonymous voting scheme', duration: '50m' },
          { title: 'Smart contract verifier', duration: '55m' },
        ],
      },
    ],
  },
  {
    id: 'sc-security',
    title: 'Smart Contract Security & Audit Workshop',
    subtitle: 'Learn the top 20 exploits, write custom slither detectors, and audit a live codebase.',
    instructor: 'auditor.eth',
    instructorScore: 960,
    category: 'Security',
    difficulty: 'Advanced',
    priceUSD: 349,
    priceW3T: 1580,
    duration: '20h 20m',
    lessons: 72,
    rating: 4.9,
    reviews: 2180,
    enrolled: 12400,
    imageColor: '#FF3864',
    tags: ['Solidity', 'Foundry', 'Reentrancy', 'Audits'],
    badge: { name: 'Security Auditor', xp: 3200, builderScore: 50 },
    chapters: [
      {
        title: 'Common Vulnerabilities',
        lessons: [
          { title: 'Reentrancy, CEI, OZ patterns', duration: '40m' },
          { title: 'Oracle manipulation & MEV', duration: '48m' },
          { title: 'Signature replay & ECDSA bugs', duration: '32m' },
        ],
      },
      {
        title: 'Tooling & Static Analysis',
        lessons: [
          { title: 'Slither, Aderyn & custom detectors', duration: '52m' },
          { title: 'Fuzzing with Foundry & Echidna', duration: '60m' },
        ],
      },
    ],
  },
  {
    id: 'ai-agent-101',
    title: 'AI Agent Engineering for Web3 Builders',
    subtitle: 'Autonomous on-chain agents, tool use, memetic swarms, and production deployment.',
    instructor: 'mirofish.ai',
    instructorScore: 890,
    category: 'AI Agents',
    difficulty: 'Intermediate',
    priceUSD: 149,
    priceW3T: 680,
    duration: '9h 15m',
    lessons: 36,
    rating: 4.7,
    reviews: 730,
    enrolled: 4200,
    imageColor: '#10A37F',
    tags: ['LangGraph', 'MCP', 'On-chain actions'],
    badge: { name: 'Agent Engineer', xp: 1500, builderScore: 20 },
    chapters: [
      {
        title: 'Agent Foundations',
        lessons: [
          { title: 'LLM reasoning patterns', duration: '24m' },
          { title: 'Tool-calling & MCP servers', duration: '38m' },
        ],
      },
      {
        title: 'On-Chain Agents',
        lessons: [
          { title: 'Signing transactions safely', duration: '44m' },
          { title: 'Swarm-based trading bots', duration: '56m' },
        ],
      },
    ],
  },
  {
    id: 'defi-legos',
    title: 'DeFi Protocols: Money Legos from Scratch',
    subtitle: 'Implement AMMs, lending markets, perpetuals, and ERC-4626 vaults in Solidity.',
    instructor: 'defigeek',
    instructorScore: 922,
    category: 'DeFi',
    difficulty: 'Intermediate',
    priceUSD: 229,
    priceW3T: 1040,
    duration: '14h 30m',
    lessons: 54,
    rating: 4.8,
    reviews: 1420,
    enrolled: 9860,
    imageColor: '#FF007A',
    tags: ['AMM', 'Lending', 'ERC-4626', 'Perps'],
    badge: { name: 'DeFi Architect', xp: 2200, builderScore: 30 },
    chapters: [
      {
        title: 'AMM Deep Dive',
        lessons: [
          { title: 'Uniswap V2 math & code', duration: '40m' },
          { title: 'Concentrated liquidity (V3)', duration: '52m' },
        ],
      },
      {
        title: 'Lending & Vaults',
        lessons: [
          { title: 'Compound-style interest models', duration: '44m' },
          { title: 'ERC-4626 tokenized vaults', duration: '36m' },
        ],
      },
    ],
  },
  {
    id: 'eth-core',
    title: 'Ethereum Core Development: EVM & Beyond',
    subtitle: 'Understand the EVM at the bytecode level, write your own mini-client, and track EIP lifecycles.',
    instructor: 'lightclient.eth',
    instructorScore: 978,
    category: 'Ethereum',
    difficulty: 'Advanced',
    priceUSD: 399,
    priceW3T: 1820,
    duration: '22h 50m',
    lessons: 82,
    rating: 4.9,
    reviews: 680,
    enrolled: 3120,
    imageColor: '#627EEA',
    tags: ['EVM', 'EIPs', 'Clients', 'P2P'],
    badge: { name: 'Core Dev', xp: 3800, builderScore: 60 },
    chapters: [
      {
        title: 'EVM Internals',
        lessons: [
          { title: 'Stack, memory, storage, opcodes', duration: '55m' },
          { title: 'Gas accounting & optimization', duration: '48m' },
        ],
      },
      {
        title: 'Client Engineering',
        lessons: [
          { title: 'Block structure & consensus', duration: '64m' },
          { title: 'Building a mini JSON-RPC client', duration: '72m' },
        ],
      },
    ],
  },
]

export function LearnClientPage() {
  const [tab, setTab] = useState<Tab>('explore')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All')
  const [selected, setSelected] = useState<Course | null>(null)
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set(['ai-agent-101']))
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<Record<string, number>>({ 'ai-agent-101': 42 })

  const filtered = useMemo(() => {
    const base = tab === 'my-learning' ? COURSES.filter((c) => enrolled.has(c.id)) : COURSES
    return base.filter((c) => {
      if (category !== 'All' && c.category !== category) return false
      if (query && !(`${c.title} ${c.subtitle} ${c.instructor}`.toLowerCase().includes(query.toLowerCase()))) return false
      return true
    })
  }, [tab, category, query, enrolled])

  function enroll(c: Course) {
    setEnrolled((p) => new Set(p).add(c.id))
    setProgress((p) => ({ ...p, [c.id]: 0 }))
  }

  function complete(c: Course) {
    setCompleted((p) => new Set(p).add(c.id))
    setProgress((p) => ({ ...p, [c.id]: 100 }))
  }

  return (
    <div className="space-y-10">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-border py-20 md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/18 blur-[120px]" />
          <div className="absolute right-[-6rem] top-24 h-[20rem] w-[20rem] rounded-full bg-chart-4/10 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              Learn & Earn
            </span>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Level up with{' '}
              <span className="shimmer-text">verified builder courses</span>
            </h1>
            <p className="mt-5 text-pretty text-muted-foreground md:text-lg">
              Take Web3 & AI courses from verified experts. Complete the final challenge and receive on-chain
              credentials — NFT badges + Builder Score + XP that show up directly in your profile.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-left sm:gap-4">
              {[
                { icon: BookOpen, value: '140+', label: 'Expert courses' },
                { icon: Trophy, value: '48 NFT badges', label: 'On-chain credentials' },
                { icon: Users, value: '92K+', label: 'Active learners' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card/50 p-4 glass">
                  <s.icon className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TABS + ACTION BAR ═══ */}
      <section className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/50 p-4 glass md:flex-row md:items-center md:justify-between md:p-5">
          {/* Tabs */}
          <div className="grid flex-1 grid-cols-3 gap-1 rounded-2xl border border-border bg-background/40 p-1 md:w-[420px]">
            {[
              { id: 'explore' as Tab, label: 'Explore courses', icon: Sparkles },
              { id: 'my-learning' as Tab, label: 'My learning', icon: BookOpen },
              { id: 'upload' as Tab, label: 'Upload content', icon: Plus },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  tab === t.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {tab !== 'upload' && (
            <div className="flex flex-1 items-center gap-2 md:justify-end">
              <div className="flex h-11 w-full flex-1 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 md:w-[320px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, instructors, topics…"
                  className="h-full flex-1 border-0 bg-transparent px-2 text-sm focus-visible:ring-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Category filter (explore & my learning) */}
        {tab !== 'upload' && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Category
            </span>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  category === c
                    ? 'border-primary/50 bg-primary/15 text-primary'
                    : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ═══ CONTENT BY TAB ═══ */}
      <section className="mx-auto max-w-6xl px-4 pb-8 md:px-6 md:pb-16">
        {tab === 'upload' ? (
          <UploadPanel />
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/40 p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No courses match your filters</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing the search or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                enrolled={enrolled.has(c.id)}
                completed={completed.has(c.id)}
                progress={progress[c.id] ?? 0}
                onOpen={() => setSelected(c)}
                onEnroll={() => enroll(c)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══ COURSE DETAIL MODAL ═══ */}
      {selected && (
        <CourseDetailModal
          course={selected}
          enrolled={enrolled.has(selected.id)}
          completed={completed.has(selected.id)}
          progress={progress[selected.id] ?? 0}
          onClose={() => setSelected(null)}
          onEnroll={() => enroll(selected)}
          onComplete={() => complete(selected)}
        />
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════
   Course Card
   ════════════════════════════════════════════════ */
function CourseCard(props: {
  course: Course
  enrolled: boolean
  completed: boolean
  progress: number
  onOpen: () => void
  onEnroll: () => void
}) {
  const { course, enrolled, completed, progress, onOpen, onEnroll } = props

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-[0_0_32px_rgba(0,0,0,0.25)]">
      {/* Art */}
      <button
        type="button"
        onClick={onOpen}
        className="relative h-44 w-full overflow-hidden text-left"
        style={{ background: `linear-gradient(135deg, ${course.imageColor}55, ${course.imageColor}15 60%, transparent)` }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, oklch(1 0 0 / 20%) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            {course.category}
          </span>
          <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            {course.difficulty}
          </span>
        </div>

        {completed && (
          <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[var(--success)]/90 px-2.5 py-1 text-[10px] font-bold text-[var(--success)]/0 backdrop-blur-sm" style={{ color: '#052e16' }}>
            <CheckCircle2 className="h-3 w-3" />
            COMPLETED
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-mono text-white/90 backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {course.duration} · {course.lessons} lessons
          </p>
        </div>

        <div className="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
          <Play className="ml-0.5 h-5 w-5 fill-primary" />
        </div>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground">
              {course.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{course.subtitle}</p>
          </div>
        </div>

        {/* Instructor */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-bold text-white" style={{ background: `linear-gradient(135deg, ${course.imageColor}, ${course.imageColor}aa)` }}>
            {course.instructor[0].toUpperCase()}
          </div>
          <span className="truncate font-medium text-foreground">@{course.instructor}</span>
          <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            <Crown className="h-3 w-3" />
            {course.instructorScore}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-[#F3BA2F] text-[#F3BA2F]" />
            <span className="font-semibold text-foreground">{course.rating}</span>
            <span className="text-muted-foreground">({(course.reviews / 1000).toFixed(1)}k)</span>
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Users className="h-3.5 w-3.5" />
            {(course.enrolled / 1000).toFixed(1)}k
          </span>
        </div>

        {/* Badge teaser */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Award className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">{course.badge.name}</p>
              <p className="text-[10px] text-muted-foreground">+{course.badge.xp} XP · +{course.badge.builderScore} Score</p>
            </div>
          </div>
          <BadgeCheck className="h-4 w-4 flex-shrink-0 text-primary" />
        </div>

        {/* Progress (if enrolled) */}
        {enrolled && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--chart-4)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer: price & CTA */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-foreground">${course.priceUSD}</span>
              <span className="text-xs text-muted-foreground">or {course.priceW3T} W3T</span>
            </div>
          </div>
          {enrolled ? (
            <Button size="sm" onClick={onOpen} className="gap-1.5 rounded-full">
              <BookOpen className="h-3.5 w-3.5" />
              {completed ? 'Review' : 'Continue'}
            </Button>
          ) : (
            <Button size="sm" onClick={onEnroll} className="gap-1.5 rounded-full">
              <Zap className="h-3.5 w-3.5" />
              Enroll
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   Upload Panel
   ════════════════════════════════════════════════ */
function UploadPanel() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Smart Contracts')
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate')
  const [priceUSD, setPriceUSD] = useState('99')
  const [duration, setDuration] = useState('')
  const [lessons, setLessons] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Form */}
      <div className="rounded-3xl border border-border bg-card/50 p-6 glass md:p-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <UploadCloud className="h-3.5 w-3.5" />
          Creator Studio
        </div>
        <h2 className="mt-3 text-2xl font-bold text-foreground">Publish your own course</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share expertise as a verified builder. When learners complete your course you earn a 70% revenue share in W3T
          + a Creator badge boost to your Builder Score.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
            setTimeout(() => setSubmitted(false), 4500)
          }}
          className="mt-6 space-y-5"
        >
          <StepIndicator steps={['Basics', 'Curriculum', 'Publish']} current={1} />

          <div className="space-y-1.5">
            <Label htmlFor="c-title" className="font-mono text-[11px] uppercase tracking-widest">Course title *</Label>
            <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <Sparkles className="h--4 w-4 text-muted-foreground" />
              <Input
                id="c-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Solidity Design Patterns"
                required
                className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-cat" className="font-mono text-[11px] uppercase tracking-widest">Category</Label>
              <select
                id="c-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="h-12 w-full rounded-xl border border-input bg-input/30 px-3.5 text-base text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                {(CATEGORIES.filter((c) => c !== 'All') as Category[]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-diff" className="font-mono text-[11px] uppercase tracking-widest">Difficulty</Label>
              <select
                id="c-diff"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="h-12 w-full rounded-xl border border-input bg-input/30 px-3.5 text-base text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-price" className="font-mono text-[11px] uppercase tracking-widest">Price (USD) *</Label>
              <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <Coins className="h--4 w-4 text-muted-foreground" />
                <Input
                  id="c-price"
                  value={priceUSD}
                  onChange={(e) => setPriceUSD(e.target.value.replace(/[^0-9]/g, ''))}
                  inputMode="numeric"
                  required
                  className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-dur" className="font-mono text-[11px] uppercase tracking-widest">Duration</Label>
              <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="c-dur"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 8h 30m"
                  className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-less" className="font-mono text-[11px] uppercase tracking-widest">Lessons</Label>
              <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <FileVideo className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="c-less"
                  value={lessons}
                  onChange={(e) => setLessons(e.target.value.replace(/[^0-9]/g, ''))}
                  inputMode="numeric"
                  placeholder="32"
                  className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Video / materials upload */}
          <div className="space-y-1.5">
            <Label className="font-mono text-[11px] uppercase tracking-widest">Upload curriculum (videos, PDFs, code)</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background/30 p-8 transition-colors hover:border-primary/40 hover:bg-primary/5">
              {files.length ? (
                <div className="w-full">
                  <div className="flex flex-wrap gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs">
                        <FileVideo className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate max-w-[180px]">{f.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setFiles((p) => p.filter((_, idx) => idx !== i))
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-center">
                    <span className="text-xs text-primary hover:underline">+ Add more files</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">Drop files here or click to browse</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">MP4 · PDF · ZIP · MD · Sol · Rs · Max 2GB</p>
                  </div>
                </>
              )}
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles((p) => [...p, ...Array.from(e.target.files ?? [])])}
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-muted-foreground">
              🎓 Completion NFT badge auto-mints to graduates. Revenue is split 70/30 (you / platform).
            </p>
            <Button type="submit" disabled={submitted || !title || !priceUSD} className="h-12 gap-2 rounded-full px-7">
              {submitted ? (
                <><CheckCircle2 className="h-4 w-4" /> Sent for review</>
              ) : (
                <><Plus className="h-4 w-4" /> Publish for review</>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Right rail: creator benefits */}
      <div className="space-y-5">
        <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card p-6 glass">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Creator rewards</h3>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { t: '70% tuition in W3T', d: 'Automatically vested per learner completion.' },
              { t: 'Creator NFT badge', d: '+50 XP · +12 Builder Score per published course.' },
              { t: 'Top Creator leaderboard', d: 'Top 5% earn extra grants & protocol royalties.' },
              { t: 'Direct mentorship', d: 'Qualified instructors get listed in /mentorship too.' },
            ].map((r) => (
              <li key={r.t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{r.t}</p>
                  <p className="text-xs text-muted-foreground">{r.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card/50 p-6 glass">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Code2 className="h-4 w-4 text-primary" />
            Verification required
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Courses are reviewed by the DAO + AI audit pipeline before listing. Your Builder Score ≥ 500 is
            required to publish. Approved courses go live in 24–48 hours.
          </p>
          <Link
            href="/profile"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Check my Builder Score →
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card/50 p-6 glass">
          <h3 className="flex items-center gap-2 font-semibold text-foreground">
            <Share2 className="h-4 w-4 text-[var(--chart-4)]" />
            Share & track reach
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Each course gets a referral link. Earn an extra 5% bounty for every learner you bring to the platform.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   Course Detail Modal
   ════════════════════════════════════════════════ */
function CourseDetailModal(props: {
  course: Course
  enrolled: boolean
  completed: boolean
  progress: number
  onClose: () => void
  onEnroll: () => void
  onComplete: () => void
}) {
  const { course, enrolled, completed, progress, onClose, onEnroll, onComplete } = props

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        aria-label="Close dialog"
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div
          className="relative p-8 md:p-10"
          style={{ background: `linear-gradient(135deg, ${course.imageColor}44 0%, ${course.imageColor}10 55%, transparent 100%)` }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              {course.category}
            </span>
            <span className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              {course.difficulty}
            </span>
            {completed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/90 px-2.5 py-0.5 text-[10px] font-bold" style={{ color: '#052e16' }}>
                <CheckCircle2 className="h-3 w-3" />
                COMPLETED
              </span>
            )}
          </div>

          <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">{course.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{course.subtitle}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#F3BA2F] text-[#F3BA2F]" />
              <b className="text-foreground">{course.rating}</b> · {course.reviews.toLocaleString()} reviews
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.enrolled.toLocaleString()} enrolled
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration} · {course.lessons} lessons
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Curriculum */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                Curriculum
              </h3>
              <div className="mt-4 space-y-3">
                {course.chapters.map((ch, ci) => (
                  <div key={ci} className="rounded-2xl border border-border bg-background/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                          {ci + 1}
                        </span>
                        <p className="font-semibold text-foreground">{ch.title}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{ch.lessons.length} lessons</span>
                    </div>
                    <ul className="mt-3 space-y-2 pl-10">
                      {ch.lessons.map((l, li) => {
                        const progressLessons = course.chapters.slice(0, ci).reduce((a, c) => a + c.lessons.length, 0) + li + 1
                        const total = course.chapters.reduce((a, c) => a + c.lessons.length, 0)
                        const done = enrolled && (progressLessons / total) * 100 <= progress
                        return (
                          <li key={li} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary/40">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className={cn(
                                'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                                done ? 'border-[var(--success)] bg-[var(--success)] text-[var(--success)]/0' : 'border-border bg-background text-muted-foreground',
                              )}>
                                {done ? <CheckCircle2 className="h-3 w-3" style={{ color: '#052e16' }} /> : li + 1}
                              </span>
                              <span className={cn('truncate text-sm', done ? 'text-foreground/60 line-through' : 'text-foreground')}>
                                {l.title}
                              </span>
                            </div>
                            <span className="flex-shrink-0 font-mono text-[11px] text-muted-foreground">{l.duration}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Enroll card */}
              <div className="rounded-2xl border border-border bg-background/40 p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">${course.priceUSD}</span>
                  <span className="text-xs text-muted-foreground">or {course.priceW3T} W3T</span>
                </div>
                <p className="mt-1 text-[11px] text-[var(--success)]">30-day money-back guarantee</p>

                {enrolled ? (
                  <div className="mt-5 space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Your progress</span>
                        <span className="font-semibold text-foreground">{progress}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--chart-4)] transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    {!completed && progress >= 100 ? null : !completed ? (
                      <Button onClick={onComplete} className="h-11 w-full gap-1.5 rounded-full">
                        <Trophy className="h-4 w-4" />
                        Mark complete & claim badge
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--success)]/40 bg-[var(--success)]/10 py-3 text-sm font-semibold text-[var(--success)]">
                        <CheckCircle2 className="h-4 w-4" />
                        Badge minted to your wallet
                      </div>
                    )}
                  </div>
                ) : (
                  <Button onClick={onEnroll} className="mt-5 h-12 w-full gap-1.5 rounded-full">
                    <Zap className="h-4 w-4" />
                    Enroll now
                  </Button>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-lg border border-border bg-card/40 py-2.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Access</p>
                    <p className="font-semibold text-foreground">Lifetime</p>
                  </div>
                  <div className="rounded-lg border border-border bg-card/40 py-2.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Cert</p>
                    <p className="font-semibold text-foreground">On-chain NFT</p>
                  </div>
                </div>
              </div>

              {/* Badge reward card */}
              <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card/60 to-card p-5">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Completion credential</h3>
                </div>
                <div className="mt-4 flex items-center gap-4 rounded-xl border border-primary/20 bg-card/70 p-3.5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[var(--chart-4)] text-primary-foreground shadow-lg">
                    <Trophy className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{course.badge.name}</p>
                    <p className="text-[11px] text-muted-foreground">Soulbound NFT · DAO-verified</p>
                    <div className="mt-2 flex gap-1.5">
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        +{course.badge.xp} XP
                      </span>
                      <span className="rounded-full bg-[var(--chart-4)]/15 px-2 py-0.5 text-[10px] font-semibold" style={{ color: 'var(--chart-4)' }}>
                        +{course.badge.builderScore} Builder Score
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Badges and XP surface directly in <Link href="/profile" className="font-semibold text-foreground hover:underline">your profile</Link>{' '}
                  and count toward <Link href="/hire" className="font-semibold text-foreground hover:underline">verified hire status</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   Step indicator (shared)
   ════════════════════════════════════════════════ */
function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-2">
          <div className={cn(
            'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors',
            i <= current
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground',
          )}>
            {i <= current ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
          </div>
          <span className={cn(
            'hidden min-w-0 flex-1 truncate text-[11px] md:block',
            i <= current ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={cn('hidden h-px flex-1 md:block', i < current ? 'bg-primary/60' : 'bg-border')} />
          )}
        </li>
      ))}
    </ol>
  )
}

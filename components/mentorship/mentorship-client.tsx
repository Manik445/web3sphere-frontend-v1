'use client'

import { useState } from 'react'
import {
  Search,
  Star,
  Clock,
  DollarSign,
  Globe,
  Filter,
  Video,
  Calendar,
  CheckCircle2,
  Sparkles,
  Users,
  TrendingUp,
} from 'lucide-react'

const EXPERTISE_FILTERS = ['All', 'DeFi', 'Smart Contracts', 'ZK Proofs', 'AI/ML', 'Layer 2', 'NFTs', 'Tokenomics', 'Security', 'Solana', 'Ethereum']

const MENTORS = [
  {
    name: 'Aria Chen',
    handle: '@aria.eth',
    avatar: 'AC',
    color: '#627EEA',
    builderScore: 920,
    expertise: ['DeFi', 'Smart Contracts', 'Ethereum'],
    bio: 'Ex-Aave core contributor. Built $500M+ in TVL protocols. Now helping the next wave of DeFi builders ship production-grade contracts.',
    rating: 4.9,
    reviews: 142,
    sessions: 380,
    languages: ['English', 'Mandarin'],
    availability: 'Available this week',
    duration: '45 min',
    price: 120,
    currency: 'USDC',
    verified: true,
  },
  {
    name: 'Marcus Rivera',
    handle: '@zk_marcus',
    avatar: 'MR',
    color: '#00D2FF',
    builderScore: 880,
    expertise: ['ZK Proofs', 'Layer 2', 'Security'],
    bio: 'ZK researcher at Polygon. Author of 3 EIPs. Passionate about making zero-knowledge tech accessible to everyday builders.',
    rating: 4.8,
    reviews: 97,
    sessions: 210,
    languages: ['English', 'Spanish'],
    availability: 'Next available: Mon',
    duration: '60 min',
    price: 180,
    currency: 'ETH',
    verified: true,
  },
  {
    name: 'Priya Sharma',
    handle: '@priya.sol',
    avatar: 'PS',
    color: '#9945FF',
    builderScore: 840,
    expertise: ['Solana', 'AI/ML', 'Tokenomics'],
    bio: 'Solana Foundation grant recipient. Built AI-powered trading bots with $10M+ volume. Bridging AI and crypto for the next generation.',
    rating: 4.7,
    reviews: 76,
    sessions: 155,
    languages: ['English', 'Hindi'],
    availability: 'Available today',
    duration: '30 min',
    price: 80,
    currency: 'USDC',
    verified: true,
  },
  {
    name: 'Kenji Tanaka',
    handle: '@kenji_nft',
    avatar: 'KT',
    color: '#FF6C37',
    builderScore: 760,
    expertise: ['NFTs', 'Tokenomics', 'Smart Contracts'],
    bio: 'Co-founder of a top-20 NFT collection. Expert in token design, community mechanics, and royalty structures for digital assets.',
    rating: 4.6,
    reviews: 58,
    sessions: 120,
    languages: ['English', 'Japanese'],
    availability: 'Next available: Wed',
    duration: '45 min',
    price: 95,
    currency: 'USDC',
    verified: false,
  },
  {
    name: 'Elena Volkov',
    handle: '@elena.defi',
    avatar: 'EV',
    color: '#FF007A',
    builderScore: 910,
    expertise: ['DeFi', 'Security', 'Ethereum'],
    bio: 'Smart contract security auditor with 200+ audits. Partner at a leading Web3 security firm. Protecting billions in on-chain value.',
    rating: 5.0,
    reviews: 203,
    sessions: 490,
    languages: ['English', 'Russian'],
    availability: 'Available this week',
    duration: '60 min',
    price: 220,
    currency: 'ETH',
    verified: true,
  },
  {
    name: 'David Osei',
    handle: '@david.l2',
    avatar: 'DO',
    color: '#F3BA2F',
    builderScore: 820,
    expertise: ['Layer 2', 'ZK Proofs', 'AI/ML'],
    bio: 'Core contributor to an L2 rollup with $2B+ bridged. Building the infrastructure that makes Ethereum scale without compromise.',
    rating: 4.7,
    reviews: 89,
    sessions: 198,
    languages: ['English', 'French'],
    availability: 'Available today',
    duration: '45 min',
    price: 140,
    currency: 'USDC',
    verified: true,
  },
]

function MentorCard({ mentor }: { mentor: typeof MENTORS[0] }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg">
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${mentor.color}10, transparent 70%)` }} />

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${mentor.color}cc, ${mentor.color}66)` }}>
            {mentor.avatar}
          </div>
          {mentor.verified && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{mentor.name}</h3>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">🏗 {mentor.builderScore}</span>
          </div>
          <p className="text-xs text-muted-foreground">{mentor.handle}</p>
          <div className="mt-1 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(mentor.rating) ? 'fill-[#F3BA2F] text-[#F3BA2F]' : 'text-muted-foreground/30'}`} />
            ))}
            <span className="ml-1 text-xs font-semibold text-foreground">{mentor.rating}</span>
            <span className="text-xs text-muted-foreground">({mentor.reviews})</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{mentor.bio}</p>

      {/* Expertise tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {mentor.expertise.map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-xs text-muted-foreground">{tag}</span>
        ))}
      </div>

      {/* Meta row */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{mentor.duration} session</div>
        <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />{mentor.languages.join(', ')}</div>
        <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{mentor.sessions} sessions held</div>
        <div className="flex items-center gap-1.5 text-[var(--success)]"><Calendar className="h-3.5 w-3.5" />{mentor.availability}</div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-foreground">{mentor.price} {mentor.currency}</span>
          <span className="ml-1 text-xs text-muted-foreground">/ session</span>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md">
          <Video className="h-3.5 w-3.5" />
          Book Session
        </button>
      </div>
    </div>
  )
}

export function MentorshipClient() {
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filtered = MENTORS.filter((m) => {
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()))
    const matchesFilter = selectedFilter === 'All' || m.expertise.includes(selectedFilter)
    return matchesSearch && matchesFilter
  })

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 animate-drift opacity-20" style={{ background: 'radial-gradient(ellipse 60% 40% at 30% 50%, oklch(0.72 0.16 235 / 15%), transparent)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, oklch(1 0 0 / 3%) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Mentorship
            </span>
            <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Learn from the builders{' '}
              <span className="shimmer-text">who shipped it</span>
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
              Book 1-on-1 sessions with verified Web3 and AI experts. Every mentor is backed by a real Builder Score, not just a LinkedIn profile.
            </p>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-10 flex max-w-xl justify-center gap-8 rounded-2xl border border-border bg-card/40 px-8 py-5 backdrop-blur-sm">
            {[
              { icon: Users, label: 'Active Mentors', value: '340+' },
              { icon: Star, label: 'Avg Rating', value: '4.8' },
              { icon: TrendingUp, label: 'Sessions Held', value: '12,400' },
            ].map(({ icon: Ic, label, value }) => (
              <div key={label} className="text-center">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Ic className="h-4 w-4" />
                </div>
                <div className="mt-2 text-xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-lg items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or expertise…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </section>

      {/* Filter tabs + cards */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* Expertise filter pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            {EXPERTISE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${selectedFilter === f ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((mentor) => <MentorCard key={mentor.handle} mentor={mentor} />)}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No mentors found for "{search}". Try a different search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Become a mentor CTA */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">Ready to share your expertise?</h2>
          <p className="mt-3 text-muted-foreground">Join 340+ mentors earning crypto by helping the next generation of Web3 builders. No agency fees — 95% goes to you.</p>
          <button className="mt-6 rounded-2xl bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg">
            Become a Mentor
          </button>
        </div>
      </section>
    </>
  )
}

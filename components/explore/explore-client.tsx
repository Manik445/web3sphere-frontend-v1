'use client'

import { useState, useEffect } from 'react'
import {
  Brain,
  Users2,
  Hash,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  GitBranch,
  Code2,
  Rocket,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Activity,
  Network,
  Star,
  BarChart2,
  Shield,
  Globe,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   AI Swarm Carousel
───────────────────────────────────────────── */
const SWARM_SLIDES = [
  {
    badge: 'Live AI Debate Swarms',
    title: 'Thousands of AI Agents Debate In Real‑Time',
    body: 'Every discussion automatically spawns thousands of AI agents powered by MiroFish — each with a unique personality, memory, bias, and reasoning pattern. The outcome is emergent collective intelligence, not a simple poll.',
    Icon: Network,
    stats: [{ label: 'Active Agents', value: '12,400' }, { label: 'Live Debates', value: '847' }, { label: 'Predictions', value: '3.2M' }],
  },
  {
    badge: 'Humans Become Nodes',
    title: 'Your Opinion Moves the Swarm',
    body: "Community members join the AI swarm as active nodes. Your contributions visibly influence sentiment shifts, graph edges, AI consensus, and debate direction — updating in real time across the network.",
    Icon: Activity,
    stats: [{ label: 'Human Nodes', value: '28,100' }, { label: 'Avg Influence', value: '68 pts' }, { label: 'Consensus Acc.', value: '94.2%' }],
  },
  {
    badge: 'Reputation‑Weighted',
    title: 'Builder Score Powers Your Influence',
    body: "Influence is reputation-weighted. A Builder Score of 900+ amplifies your impact on the swarm's consensus — newcomers contribute, but experienced builders carry greater weight.",
    Icon: Star,
    stats: [{ label: 'Max Builder Score', value: '1,000' }, { label: 'Avg Score', value: '420' }, { label: 'Top Influencers', value: '340' }],
  },
  {
    badge: 'Structured Reports',
    title: 'Emergent Intelligence → Prediction Reports',
    body: 'When a debate ends, Web3Sphere auto‑generates structured prediction reports: future scenarios, risks, ripple effects, alternative timelines, confidence scores — all from swarm behavior.',
    Icon: BarChart2,
    stats: [{ label: 'Reports Generated', value: '18,200' }, { label: 'Avg Confidence', value: '87%' }, { label: 'VC Subscribers', value: '210+' }],
  },
  {
    badge: 'Intelligence Archive',
    title: 'Permanent On‑Chain Intelligence Archive',
    body: 'Every completed prediction becomes a permanent, optionally on-chain intelligence asset — timestamped with participants, confidence, and outcome. A living archive for VCs, DAOs, and researchers.',
    Icon: Shield,
    stats: [{ label: 'Archive Entries', value: '94,000' }, { label: 'On‑Chain Verified', value: '31,400' }, { label: 'Institutions', value: '120+' }],
  },
]

const NODES = [
  { x: 12, y: 18, active: true }, { x: 30, y: 38, active: true }, { x: 50, y: 12, active: false },
  { x: 70, y: 28, active: true }, { x: 88, y: 52, active: true }, { x: 62, y: 60, active: false },
  { x: 38, y: 70, active: true }, { x: 18, y: 62, active: false }, { x: 80, y: 80, active: true },
  { x: 92, y: 18, active: false }, { x: 8, y: 48, active: true }, { x: 54, y: 88, active: false },
]

const LINES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [4, 5], [1, 7],
]

function SwarmViz() {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-sm">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {LINES.map(([a, b], i) => (
          <line
            key={i}
            x1={`${NODES[a].x}%`} y1={`${NODES[a].y}%`}
            x2={`${NODES[b].x}%`} y2={`${NODES[b].y}%`}
            stroke="oklch(0.72 0.16 235 / 25%)"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="animate-dash"
          />
        ))}
      </svg>
      {NODES.map((n, i) => (
        <div key={i} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)' }}>
          <div className={`relative h-3 w-3 rounded-full transition-colors ${n.active ? 'bg-primary' : 'bg-muted-foreground/25'}`}>
            {n.active && <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-40" />}
          </div>
        </div>
      ))}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg border border-border bg-card/70 px-3 py-1.5 text-xs backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" />
          Live swarm active
        </span>
        <span className="font-mono text-primary">12,400 agents</span>
      </div>
    </div>
  )
}

function AISwarmCarousel() {
  const [active, setActive] = useState(0)
  const total = SWARM_SLIDES.length

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % total), 6000)
    return () => clearInterval(t)
  }, [total])

  const slide = SWARM_SLIDES[active]
  const { Icon } = slide

  return (
    <section className="relative overflow-hidden border-b border-border py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 animate-drift opacity-20" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.72 0.16 235 / 15%), transparent)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, oklch(1 0 0 / 3%) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Brain className="h-3.5 w-3.5 animate-ai-blink" />
            AI Swarm Intelligence
          </span>
          <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Predict the Future with{' '}
            <span className="shimmer-text">AI Swarm Intelligence</span>
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
            Every community debate evolves into a living AI simulation. Web3Sphere launches thousands of AI agents transforming discussions into a crowd-intelligence prediction engine.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
          <div className="p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Icon className="h-3.5 w-3.5" />
                  {slide.badge}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-foreground">{slide.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{slide.body}</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {slide.stats.map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-card/60 p-3 text-center">
                      <div className="text-lg font-bold text-primary">{s.value}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SwarmViz />
                <div className="mt-4 flex items-center justify-center gap-2">
                  {SWARM_SLIDES.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border px-6 py-3">
            <span className="text-xs text-muted-foreground">{active + 1} / {total}</span>
            <div className="flex gap-2">
              {[
                { Icon: ChevronLeft, dir: -1 },
                { Icon: ChevronRight, dir: 1 },
              ].map(({ Icon: Ic, dir }) => (
                <button key={dir} onClick={() => setActive((p) => (p + dir + total) % total)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground">
                  <Ic className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Builder Collaboration Rooms
───────────────────────────────────────────── */
const ROOMS = [
  { name: 'Ethereum Core', topic: 'Ethereum', members: 1240, live: true, type: 'Chat', color: '#627EEA' },
  { name: 'Solana Builders', topic: 'Solana', members: 880, live: true, type: 'Voice', color: '#9945FF' },
  { name: 'AI Agents Hub', topic: 'AI Agents', members: 2100, live: true, type: 'Chat', color: '#10A37F' },
  { name: 'DeFi Research', topic: 'DeFi', members: 640, live: false, type: 'Threaded', color: '#FF007A' },
  { name: 'ZK Proofs', topic: 'ZK', members: 420, live: false, type: 'Chat', color: '#00D2FF' },
  { name: 'Hackathon 2026', topic: 'Hackathons', members: 3200, live: true, type: 'Voice', color: '#F3BA2F' },
  { name: 'Startup Fundraise', topic: 'Startup Funding', members: 560, live: false, type: 'Chat', color: '#0052FF' },
  { name: 'Smart Contracts', topic: 'Smart Contracts', members: 780, live: false, type: 'Threaded', color: '#5741D9' },
  { name: 'NFT Alpha', topic: 'NFTs', members: 920, live: true, type: 'Chat', color: '#FF6C37' },
]

function CollaborationRooms() {
  return (
    <section className="relative border-b border-border py-20 md:py-24">
      <div className="pointer-events-none absolute -right-32 top-32 h-80 w-80 rounded-full bg-chart-4/5 blur-3xl" />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Users2 className="h-3.5 w-3.5" />
            Builder Collaboration Rooms
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Verified builders.{' '}
            <span className="shimmer-text">Signal‑only conversations.</span>
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Every participant is backed by a verified Builder Score identity — dramatically improving discussion quality over Discord or Telegram.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((room) => (
            <div key={room.name} className="group relative overflow-hidden rounded-xl border border-border bg-card/40 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card">
              <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${room.color}10, transparent 70%)` }} />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${room.color}cc, ${room.color}66)` }}>
                    <Hash className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{room.name}</h3>
                    <p className="text-xs text-muted-foreground">{room.topic}</p>
                  </div>
                </div>
                {room.live && (
                  <span className="flex items-center gap-1 rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-xs font-medium text-[var(--success)]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" />
                    Live
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users2 className="h-3 w-3" />{room.members.toLocaleString()} members</span>
                <span className="rounded-full border border-border px-2 py-0.5">{room.type}</span>
              </div>
              <button className="mt-3 w-full rounded-lg border border-border bg-secondary/50 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
                Join Room
              </button>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          + 40 more rooms across Governance · Security · Research · Product Launches · Layer 2 · Bitcoin
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Builder Feed
───────────────────────────────────────────── */
const FEED_POSTS = [
  {
    user: 'vitalik.eth', handle: '@vitalikb', avatar: 'VB', avatarColor: '#627EEA', builderScore: 980, time: '2m ago',
    content: 'Just deployed a new ZK verification contract on Ethereum mainnet. Gas savings of ~40% vs our previous iteration. Full audit report dropping tomorrow. 🔐',
    tags: ['#ZKProofs', '#Ethereum', '#SmartContracts'], likes: 2840, comments: 412, reposts: 897,
    type: 'Smart Contract Deploy', typeColor: '#627EEA',
  },
  {
    user: 'solana_dev.sol', handle: '@solvr', avatar: 'SD', avatarColor: '#9945FF', builderScore: 710, time: '15m ago',
    content: 'Our AI agent just auto-rebalanced a $2M DeFi portfolio with 0 human intervention. On-chain logs are public — verify yourself. This is what builder-grade automation looks like. 🤖',
    tags: ['#AIAgents', '#DeFi', '#Solana'], likes: 1230, comments: 198, reposts: 544,
    type: 'AI Discovery', typeColor: '#10A37F',
  },
  {
    user: 'layer2_maxi', handle: '@l2maxi', avatar: 'L2', avatarColor: '#FF007A', builderScore: 580, time: '1h ago',
    content: 'Raised $3.2M seed from a16z Crypto for our cross-chain liquidity protocol. 18 months of building in stealth, shipping to mainnet Q3 2026. LFG 🚀',
    tags: ['#Funding', '#Layer2', '#DeFi'], likes: 4100, comments: 760, reposts: 1340,
    type: 'Funding Announcement', typeColor: '#F3BA2F',
  },
]

function BuilderFeed() {
  const [liked, setLiked] = useState<Set<number>>(new Set())

  return (
    <section className="relative py-20 md:py-24">
      <div className="pointer-events-none absolute -left-32 bottom-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                Builder Updates
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">The Signal Feed for Web3 Builders</h2>
              <p className="mt-2 text-sm text-muted-foreground">Share deployments, discoveries, launches, and milestones — verified by Builder Score.</p>
            </div>

            {/* Compose */}
            <div className="mb-4 rounded-xl border border-border bg-card/40 p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">You</div>
                <input type="text" placeholder="Share a builder update…" className="flex-1 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-2 text-muted-foreground">
                  {[Code2, GitBranch, Rocket].map((Ic, i) => (
                    <button key={i} className="rounded-md p-1.5 hover:bg-secondary hover:text-foreground transition-colors"><Ic className="h-4 w-4" /></button>
                  ))}
                </div>
                <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Post Update</button>
              </div>
            </div>

            <div className="space-y-3">
              {FEED_POSTS.map((post, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/40 p-5 transition-all hover:border-primary/20 hover:bg-card">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${post.avatarColor}cc, ${post.avatarColor}66)` }}>{post.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{post.user}</span>
                        <span className="text-xs text-muted-foreground">{post.handle}</span>
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">🏗 {post.builderScore}</span>
                        <span className="text-xs text-muted-foreground">{post.time}</span>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{ background: `${post.typeColor}18`, color: post.typeColor }}>{post.type}</div>
                      <p className="mt-2 text-sm text-foreground leading-relaxed">{post.content}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => <span key={tag} className="text-xs text-primary cursor-pointer hover:underline">{tag}</span>)}
                      </div>
                      <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
                        <button onClick={() => setLiked((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; })}
                          className={`flex items-center gap-1 transition-colors hover:text-red-400 ${liked.has(i) ? 'text-red-400' : ''}`}>
                          <Heart className={`h-3.5 w-3.5 ${liked.has(i) ? 'fill-red-400' : ''}`} />{post.likes + (liked.has(i) ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors"><MessageSquare className="h-3.5 w-3.5" />{post.comments}</button>
                        <button className="flex items-center gap-1 hover:text-[var(--success)] transition-colors"><Share2 className="h-3.5 w-3.5" />{post.reposts}</button>
                        <button className="ml-auto flex items-center gap-1 hover:text-primary transition-colors"><Bookmark className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card/40 p-5">
              <h3 className="text-sm font-semibold text-foreground">🔥 Trending Topics</h3>
              <div className="mt-3 space-y-2.5">
                {['#ZKProofs', '#AIAgents', '#Solana', '#DeFi2026', '#BuilderScore', '#Hackathon'].map((t, i) => (
                  <div key={t} className="flex items-center justify-between">
                    <span className="text-sm text-primary hover:underline cursor-pointer">{t}</span>
                    <span className="text-xs text-muted-foreground">{Math.floor(1200 - i * 180)} posts</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card/40 p-5">
              <h3 className="text-sm font-semibold text-foreground">⚡ Top Builders</h3>
              <div className="mt-3 space-y-3">
                {[
                  { name: 'vitalik.eth', score: 980, color: '#627EEA' },
                  { name: 'anatoly.sol', score: 940, color: '#9945FF' },
                  { name: 'hayd3n.base', score: 890, color: '#0052FF' },
                ].map((b) => (
                  <div key={b.name} className="flex items-center gap-2">
                    <div className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: b.color }}>{b.name[0].toUpperCase()}</div>
                    <p className="flex-1 text-xs font-medium text-foreground">{b.name}</p>
                    <span className="text-xs font-bold text-primary">🏗 {b.score}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <h3 className="text-sm font-semibold text-foreground">🚀 Live Hackathon</h3>
              <p className="mt-1 text-xs text-muted-foreground">Web3Sphere Build Sprint 2026 — 3 days left</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">$120,000 prize pool · 3,200 builders</p>
              <button className="mt-3 w-full rounded-lg bg-primary py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Join Hackathon</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   Export
───────────────────────────────────────────── */
export function ExploreClientPage() {
  return (
    <>
      <AISwarmCarousel />
      <CollaborationRooms />
      <BuilderFeed />
    </>
  )
}

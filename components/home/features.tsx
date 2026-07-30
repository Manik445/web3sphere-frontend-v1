'use client'

import {
  Users,
  Fingerprint,
  MessagesSquare,
  Brain,
  Trophy,
  Search,
  ArrowLeftRight,
  GraduationCap,
  Bot,
  FileText,
  BarChart3,
  Cpu,
  Sparkles,
  BookOpen,
  Award,
  Landmark,
  Wallet,
} from 'lucide-react'
import { useMode } from '@/components/mode-provider'

const WEB3_FEATURES = [
  {
    icon: Fingerprint,
    title: 'On-Chain Identity',
    desc: 'Profiles backed by wallets, NFTs, SBTs, and POAPs — a verifiable reputation you truly own.',
  },
  {
    icon: BookOpen,
    title: 'Learn · Courses & Badges',
    desc: 'Take expert courses in SCs, ZK, DeFi, Agents. Mint completion NFTs that boost your Builder Score.',
  },
  {
    icon: Wallet,
    title: 'Fiat & Crypto Payments',
    desc: 'INR deposits via UPI/NEFT/RTGS, instant P2P crypto by username, escrow, and splits — all in one wallet.',
  },
  {
    icon: Users,
    title: 'Community Hub & Rooms',
    desc: 'Global, coin-specific, and mentorship rooms for focused, high-signal conversation with builders.',
  },
  {
    icon: Search,
    title: 'Wallet Lookup & Explore',
    desc: 'Search any address to see the human behind it: activity, holdings, badges, and trust score.',
  },
  {
    icon: Trophy,
    title: 'Builder Score · XP · Reputation',
    desc: 'Earn XP, soulbound achievements, and DAO badges that travel with your wallet everywhere.',
  },
  {
    icon: MessagesSquare,
    title: 'Q&A Forum with Bounties',
    desc: 'StackOverflow-style questions with on-chain tips, XP, and badges for helpful answers.',
  },
  {
    icon: ArrowLeftRight,
    title: 'P2P Payments & Swaps',
    desc: 'Send crypto to a username, split bills, and swap tokens at best-rate — without leaving the app.',
  },
  {
    icon: Award,
    title: 'Course Creator Studio',
    desc: 'Upload courses as a verified builder, earn 70% tuition share + Creator badge + Builder Score.',
  },
  {
    icon: GraduationCap,
    title: 'Mentorship Marketplace',
    desc: 'Book top builders for sessions paid in W3T, rated and rewarded by the community.',
  },
  {
    icon: Landmark,
    title: 'Verified Talent Hire Network',
    desc: 'Hire pre-vetted developers. Check Builder Score, on-chain portfolio, escrow-protected contracts.',
  },
  {
    icon: Brain,
    title: 'AI Intelligence Feed',
    desc: 'Personalized Web3 + AI news fusing GitHub, Farcaster, X, and on-chain events into one feed.',
  },
]

const AI_FEATURES = [
  {
    icon: Fingerprint,
    title: 'AI Builder Identity',
    desc: 'A verifiable profile of your models, datasets, benchmarks, and shipped agents — provably yours.',
  },
  {
    icon: BookOpen,
    title: 'Learn · Courses & Badges',
    desc: 'From transformers to agent engineering. Complete courses, mint NFTs, boost your Builder Score.',
  },
  {
    icon: Wallet,
    title: 'Fiat & Crypto Payments',
    desc: 'INR deposits via UPI/NEFT/RTGS, P2P crypto by username, compute bounties, escrow & splits.',
  },
  {
    icon: Brain,
    title: 'AI Intelligence Feed',
    desc: 'A personalized stream of model launches, research papers, and funding rounds across every major lab.',
  },
  {
    icon: Bot,
    title: 'Agent & Prompt Hub',
    desc: 'Publish agents and prompt chains, get community reviews, and track real-world usage.',
  },
  {
    icon: BarChart3,
    title: 'Model Leaderboards',
    desc: 'Compare models on cost, latency, and quality with community-weighted, transparent benchmarks.',
  },
  {
    icon: FileText,
    title: 'Research Digest',
    desc: 'Daily AI-summarized digests of arXiv papers and lab blogs, tuned to the topics you follow.',
  },
  {
    icon: Trophy,
    title: 'Builder Score · XP · Reputation',
    desc: 'Earn XP for answers, code reviews, papers, shipped agents, and verified client work.',
  },
  {
    icon: MessagesSquare,
    title: 'Q&A Forum with Bounties',
    desc: 'Ask ML and engineering questions, earn reputation, and get answers from verified practitioners.',
  },
  {
    icon: Award,
    title: 'Course Creator Studio',
    desc: 'Publish courses. 70% tuition in W3T, creator NFT badge, +12 Builder Score per course.',
  },
  {
    icon: Cpu,
    title: 'Compute Marketplace',
    desc: 'Find GPUs and inference credits, or rent out spare compute to other builders in the network.',
  },
  {
    icon: GraduationCap,
    title: 'Mentorship Marketplace',
    desc: 'Learn from researchers and founders in 1:1 sessions, rated and rewarded by the community.',
  },
]

const COPY = {
  web3: {
    eyebrow: 'The platform · 12 modules',
    title: 'Identity, Learn, Earn, Work, Pay — all on-chain',
    body: 'Everything Web3 professionals need across a decade of career growth. Learn, build, get paid, hire talent, mentor, and move fiat + crypto — with one verified identity.',
    features: WEB3_FEATURES,
  },
  ai: {
    eyebrow: 'The platform · 12 modules',
    title: 'Identity, Learn, Earn, Work, Compute — all verifiable',
    body: 'From research to shipped agents. Build your AI portfolio, find compute, get hired, mentor, learn — with reputation you own and take anywhere.',
    features: AI_FEATURES,
  },
} as const

export function Features() {
  const { mode } = useMode()
  const c = COPY[mode]

  return (
    <section id="community" className="relative border-t border-border py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {c.eyebrow}
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {c.title}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">{c.body}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card/40 p-6 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

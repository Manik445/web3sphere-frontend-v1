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
} from 'lucide-react'
import { useMode } from '@/components/mode-provider'

const WEB3_FEATURES = [
  {
    icon: Users,
    title: 'Community Hub & Rooms',
    desc: 'A global room plus coin-specific and mentorship rooms for focused, high-signal conversation.',
  },
  {
    icon: Fingerprint,
    title: 'On-Chain Identity',
    desc: 'Profiles backed by wallets, NFTs, SBTs, and POAPs — a verifiable reputation you truly own.',
  },
  {
    icon: Search,
    title: 'Wallet Lookup',
    desc: 'Search any address and instantly see the human behind it: activity, holdings, and trust badge.',
  },
  {
    icon: MessagesSquare,
    title: 'Q&A Forum',
    desc: 'StackOverflow-style questions with on-chain tips, XP, and badges for helpful answers.',
  },
  {
    icon: Trophy,
    title: 'Gamified Reputation',
    desc: 'Earn XP, soulbound achievements, and DAO badges that travel with your wallet everywhere.',
  },
  {
    icon: ArrowLeftRight,
    title: 'P2P Payments & Swaps',
    desc: 'Send crypto to a username, split bills, and swap tokens at best-rate — without leaving the app.',
  },
  {
    icon: GraduationCap,
    title: 'Mentorship Marketplace',
    desc: 'Book top builders for sessions paid in W3T, rated and rewarded by the community.',
  },
  {
    icon: Brain,
    title: 'AI Intelligence Feed',
    desc: 'Personalized Web3 + AI news fusing GitHub, Farcaster, X, and on-chain events into one feed.',
  },
]

const AI_FEATURES = [
  {
    icon: Brain,
    title: 'AI Intelligence Feed',
    desc: 'A personalized stream of model launches, research papers, and funding rounds across every major lab.',
  },
  {
    icon: Fingerprint,
    title: 'AI Builder Identity',
    desc: 'A verifiable profile of your models, datasets, benchmarks, and shipped agents — provably yours.',
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
    icon: MessagesSquare,
    title: 'Q&A Forum',
    desc: 'Ask ML and engineering questions, earn reputation, and get answers from verified practitioners.',
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
    eyebrow: 'Core platform',
    title: 'Everything a Web3 professional needs, in one place',
    body: 'No more scattering across Twitter, Discord, Telegram, and GitHub. Web3Sphere unifies your identity, network, and money.',
    features: WEB3_FEATURES,
  },
  ai: {
    eyebrow: 'Core platform',
    title: 'Everything an AI builder needs, in one place',
    body: 'From research to shipped agents, Web3Sphere unifies your AI identity, knowledge feed, and professional network — no more scattering across a dozen tools.',
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

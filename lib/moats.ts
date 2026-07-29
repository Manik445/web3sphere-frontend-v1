export type Moat = {
  id: string
  /** URL slug; only featured moats link to a dedicated page. */
  slug?: string
  number: string
  title: string
  tagline: string
  summary: string
  points: string[]
}

export const MOATS: Moat[] = [
  {
    id: 'predict-future',
    slug: 'predict-future',
    number: '01',
    title: 'Predict Future',
    tagline: 'AI swarm intelligence on live debates',
    summary:
      'The only platform where community debates become living AI simulations. Every open debate spawns thousands of AI agents with unique personalities — and real users join as nodes inside the swarm.',
    points: [
      'Every debate triggers a live swarm of AI agents, each with distinct viewpoints, memories, and personalities — producing emergent predictions, not simple polls.',
      'Real users attach as nodes inside the agent graph; your opinion literally shifts the AI consensus in real time on the live swarm canvas.',
      'Your Builder Score sets your influence weight — a score-900 expert moves consensus more than a score-100 newcomer.',
      'When the timer ends, the platform auto-generates a structured prediction report: likely futures, key risks, ripple effects, and a confidence score.',
      'Each completed simulation becomes a permanently archived, on-chain verifiable intelligence asset that protocols, VCs, and research firms pay to access.',
    ],
  },
  {
    id: 'builder-score',
    number: '02',
    title: 'On-chain Builder Score',
    tagline: 'The reputation layer no one can copy',
    summary:
      'A proprietary reputation algorithm aggregating years of on-chain activity, GitHub history, and verified work into a single tamper-proof score. Once 100,000 builders have scores, the dataset is irreproducible.',
    points: [
      'Scores derive from immutable on-chain data — deployed contracts, DAO votes, and audit records that cannot be faked or inflated.',
      'Platform job history only accumulates inside Web3Sphere, creating a financial incentive to stay forever.',
      'The Builder Score API becomes a standalone B2B product sold to LinkedIn, AngelList, and VC firms.',
      'Soulbound Token issuance lets builders carry their score as portable identity across any Web3 app.',
    ],
  },
  {
    id: 'marketplace-flywheel',
    number: '03',
    title: 'Two-sided marketplace flywheel',
    tagline: 'The compounding network effect',
    summary:
      'Every new company brings jobs. Every new job attracts builders. Every new builder improves the talent pool. The first platform to reach critical mass becomes the default.',
    points: [
      'Bidirectional network effect: each side\u2019s growth accelerates the other.',
      'Project history, team data, and integrations create deep switching costs.',
      'A referral loop with a viral coefficient above 1 makes paid acquisition nearly unnecessary.',
    ],
  },
  {
    id: 'operating-system',
    number: '04',
    title: 'All-in-one operating system',
    tagline: 'Replacing six tools with one',
    summary:
      'Web3Sphere replaces Upwork, ClickUp, Slack, Notion, Calendly, and payroll tools — in a single workspace built specifically for Web3 and AI companies.',
    points: [
      'Unified hiring, project management, communication, VMs, and payroll saves teams 6–10 hours per week.',
      'GitHub, ClickUp, Jira, and Notion integrations reduce adoption friction to near zero.',
      'Smart contract escrow releases funds automatically on GitHub merge or ticket close.',
    ],
  },
  {
    id: 'talent-matching',
    number: '05',
    title: 'AI talent matching',
    tagline: 'Find the right builder in 60 seconds',
    summary:
      'Paste your GitHub repo URL. Our AI reads your codebase, tech stack, and open issues — then surfaces the five best-matched builders from our verified pool instantly.',
    points: [
      'The matching model trains on real "good hire" vs "bad hire" outcomes.',
      'Codebase analysis identifies complexity, architecture patterns, and collaboration style.',
      'More hires → more outcome data → better matches: the moat widens automatically.',
    ],
  },
  {
    id: 'crypto-payroll',
    number: '06',
    title: 'Crypto-native payroll & escrow',
    tagline: 'Global pay in seconds, trustless releases',
    summary:
      'Pay any contractor globally in USDC, ETH, or SOL in seconds — no wire transfers, no banking delays, no SWIFT fees.',
    points: [
      'Trustless smart contract escrow releases funds automatically when milestones complete.',
      'Multi-currency payroll removes the geographic barrier from hiring entirely.',
      'Yield on idle escrow balances generates passive revenue for the platform.',
    ],
  },
  {
    id: 'collaboration-rooms',
    number: '07',
    title: 'Builder collaboration rooms',
    tagline: 'Social meet spaces tied to real identity',
    summary:
      'Topic-based rooms, event spaces, and live collaboration channels built for async-first global teams — all connected to verified Builder Score identity.',
    points: [
      'Participants are identified by verified credentials, not anonymous handles.',
      'Event-based rooms create recurring reasons to return daily.',
      'Teams that collaborate in rooms are 3× more likely to convert to paid engagements.',
    ],
  },
  {
    id: 'market-intelligence',
    number: '08',
    title: 'Talent market intelligence',
    tagline: 'The Bloomberg data play',
    summary:
      'As the largest verified database of Web3 builder activity, Web3Sphere becomes a market intelligence platform sold to VCs, L1 foundations, and research firms.',
    points: [
      'The annual Web3 Talent Report becomes the most-cited source for workforce data.',
      'VC firms pay $5,000–$50,000/year for founding-team Builder Score reports.',
      'Protocol funds pay for talent concentration maps to target developer grants.',
    ],
  },
]

export const REVENUE_STREAMS = [
  { label: 'Marketplace fees', detail: 'Hiring + project commissions' },
  { label: 'SaaS subscriptions', detail: 'Pro + enterprise B2B suite' },
  { label: 'Financial rails', detail: 'Swap, payroll & escrow yield' },
  { label: 'Data & API revenue', detail: 'Builder Score + intelligence' },
  { label: 'Token economy', detail: 'W3T engagement & staking' },
]

export function getMoat(slug: string): Moat | undefined {
  return MOATS.find((m) => m.slug === slug || m.id === slug)
}

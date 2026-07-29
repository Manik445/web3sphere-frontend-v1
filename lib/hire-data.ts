// Mock data for the Web3Sphere freelance marketplace (/hire).
// All data here is demo/sample data — no backend or persistence.

export type Basis = 'hourly' | 'fixed' | 'milestone'
export type JobCategory =
  | 'Smart Contracts'
  | 'Security & Audits'
  | 'Frontend'
  | 'Backend / DevOps'
  | 'AI / ML'
  | 'Design'
  | 'Product'

export type JobStatus = 'open' | 'in-review' | 'closed'

export type Milestone = {
  title: string
  amount: number
  status: 'pending' | 'active' | 'released'
}

export type Job = {
  id: string
  title: string
  companyId: string
  category: JobCategory
  basis: Basis
  budget: number // total USD (fixed/milestone) or hourly rate
  currency: string // settlement token
  status: JobStatus
  postedAt: string
  duration: string
  location: string
  minBuilderScore: number
  skills: string[]
  summary: string
  description: string
  responsibilities: string[]
  milestones: Milestone[]
  proposals: number
  track: 'web3' | 'ai'
}

export type Company = {
  id: string
  name: string
  logoInitials: string
  verified: boolean
  tagline: string
  about: string
  website: string
  location: string
  size: string
  founded: string
  totalSpent: number
  hires: number
  rating: number
  stack: string[]
}

export type Freelancer = {
  id: string
  name: string
  handle: string
  title: string
  verified: boolean
  builderScore: number
  hourlyRate: number
  location: string
  availability: string
  about: string
  skills: string[]
  githubCommits: number
  onChainContribs: number
  hackathonWins: number
  jobsCompleted: number
  rating: number
  earned: number
}

// ---------------------------------------------------------------------------
// Current signed-in user (for the bid trust gate). Demo user.
// ---------------------------------------------------------------------------
export const currentUser: Freelancer = {
  id: 'me',
  name: 'Ava Chen',
  handle: 'avabuilds',
  title: 'Full-stack Web3 Engineer',
  verified: true,
  builderScore: 782,
  hourlyRate: 95,
  location: 'Remote · GMT+1',
  availability: 'Open to work',
  about:
    'Solidity + React engineer. Shipped 3 audited protocols and maintain an open-source account abstraction SDK.',
  skills: ['Solidity', 'React', 'TypeScript', 'Foundry', 'The Graph', 'Node.js', 'Viem'],
  githubCommits: 3120,
  onChainContribs: 214,
  hackathonWins: 4,
  jobsCompleted: 27,
  rating: 4.9,
  earned: 184000,
}

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------
export const companies: Company[] = [
  {
    id: 'aurora-labs',
    name: 'Aurora Labs',
    logoInitials: 'AL',
    verified: true,
    tagline: 'Modular L2 infrastructure for high-throughput DeFi',
    about:
      'Aurora Labs builds a modular rollup stack powering the next generation of DeFi protocols. We are a fully remote team of 40 builders shipping production infrastructure used by billions in TVL.',
    website: 'auroralabs.xyz',
    location: 'Remote · Global',
    size: '40-60',
    founded: '2021',
    totalSpent: 1240000,
    hires: 38,
    rating: 4.9,
    stack: ['Rust', 'Solidity', 'Go', 'React', 'Kubernetes'],
  },
  {
    id: 'nimbus-ai',
    name: 'Nimbus AI',
    logoInitials: 'NA',
    verified: true,
    tagline: 'On-chain inference and verifiable AI agents',
    about:
      'Nimbus AI is building the coordination layer for autonomous agents that transact on-chain. Backed by top crypto funds, we work at the intersection of ML and cryptography.',
    website: 'nimbus.ai',
    location: 'Remote · Americas',
    size: '20-40',
    founded: '2023',
    totalSpent: 680000,
    hires: 19,
    rating: 4.8,
    stack: ['Python', 'PyTorch', 'Solidity', 'TypeScript', 'Ray'],
  },
  {
    id: 'ledger-guild',
    name: 'Ledger Guild',
    logoInitials: 'LG',
    verified: false,
    tagline: 'Security research & smart contract audits',
    about:
      'A collective of independent security researchers offering audits and formal verification for protocols across EVM chains and Solana.',
    website: 'ledgerguild.io',
    location: 'Remote · EU',
    size: '10-20',
    founded: '2022',
    totalSpent: 410000,
    hires: 12,
    rating: 4.7,
    stack: ['Foundry', 'Halmos', 'Certora', 'Solidity', 'Rust'],
  },
]

// ---------------------------------------------------------------------------
// Freelancers
// ---------------------------------------------------------------------------
export const freelancers: Freelancer[] = [
  currentUser,
  {
    id: 'kai-mora',
    name: 'Kai Mora',
    handle: 'kaisec',
    title: 'Smart Contract Auditor',
    verified: true,
    builderScore: 861,
    hourlyRate: 140,
    location: 'Remote · GMT+2',
    availability: 'Open to work',
    about:
      'Security researcher with 40+ audits across EVM and Solana. Found critical bugs in top-10 protocols. Formal verification with Certora & Halmos.',
    skills: ['Solidity', 'Foundry', 'Certora', 'Rust', 'Security', 'Formal Verification'],
    githubCommits: 1980,
    onChainContribs: 96,
    hackathonWins: 2,
    jobsCompleted: 41,
    rating: 5.0,
    earned: 512000,
  },
  {
    id: 'lena-ross',
    name: 'Lena Ross',
    handle: 'lenaml',
    title: 'ML Engineer · Agents',
    verified: true,
    builderScore: 734,
    hourlyRate: 110,
    location: 'Remote · GMT-5',
    availability: 'Booked until next month',
    about:
      'Applied ML engineer specializing in agentic systems, RAG, and model fine-tuning. Ex-research lab, now building autonomous on-chain agents.',
    skills: ['Python', 'PyTorch', 'LangGraph', 'RAG', 'MLOps', 'TypeScript'],
    githubCommits: 2450,
    onChainContribs: 32,
    hackathonWins: 3,
    jobsCompleted: 22,
    rating: 4.9,
    earned: 268000,
  },
  {
    id: 'diego-santos',
    name: 'Diego Santos',
    handle: 'diegofe',
    title: 'Frontend / dApp Engineer',
    verified: false,
    builderScore: 588,
    hourlyRate: 75,
    location: 'Remote · GMT-3',
    availability: 'Open to work',
    about:
      'Frontend engineer focused on wallet UX and dApp interfaces. Building delightful, accessible Web3 products with React and viem.',
    skills: ['React', 'TypeScript', 'Next.js', 'Viem', 'Wagmi', 'Tailwind'],
    githubCommits: 1420,
    onChainContribs: 18,
    hackathonWins: 1,
    jobsCompleted: 14,
    rating: 4.6,
    earned: 92000,
  },
]

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------
export const jobs: Job[] = [
  {
    id: 'aave-vault-strategy',
    title: 'Build an ERC-4626 yield vault with automated strategies',
    companyId: 'aurora-labs',
    category: 'Smart Contracts',
    basis: 'milestone',
    budget: 42000,
    currency: 'USDC',
    status: 'open',
    postedAt: '2 days ago',
    duration: '6-8 weeks',
    location: 'Remote',
    minBuilderScore: 700,
    skills: ['Solidity', 'Foundry', 'ERC-4626', 'DeFi'],
    summary:
      'Design and implement a production-grade ERC-4626 vault with pluggable yield strategies and a full Foundry test suite.',
    description:
      'We are launching a new yield product and need an experienced smart contract engineer to build the vault core. The vault must support multiple pluggable strategies, emergency pause, and role-based access control. Work happens in our shared workspace with tickets tracked in ClickUp and weekly syncs on Slack.',
    responsibilities: [
      'Implement an ERC-4626 compliant vault with strategy routing',
      'Write comprehensive Foundry tests with >95% coverage',
      'Integrate role-based access control and emergency circuit breakers',
      'Document architecture and prepare the codebase for external audit',
    ],
    milestones: [
      { title: 'Vault core + interfaces', amount: 14000, status: 'active' },
      { title: 'Strategy modules + tests', amount: 18000, status: 'pending' },
      { title: 'Audit prep + docs', amount: 10000, status: 'pending' },
    ],
    proposals: 11,
    track: 'web3',
  },
  {
    id: 'protocol-audit',
    title: 'Security audit for a lending protocol before mainnet',
    companyId: 'ledger-guild',
    category: 'Security & Audits',
    basis: 'fixed',
    budget: 28000,
    currency: 'USDC',
    status: 'open',
    postedAt: '5 days ago',
    duration: '3 weeks',
    location: 'Remote',
    minBuilderScore: 800,
    skills: ['Solidity', 'Security', 'Foundry', 'Formal Verification'],
    summary:
      'Full security review of a 4,000-line lending protocol with a written report and remediation review.',
    description:
      'We need a senior auditor to perform a thorough security review of our lending markets ahead of mainnet. Deliverables include a detailed report, severity classification, and a remediation re-review. Only auditors with a proven track record and a high Builder Score should apply.',
    responsibilities: [
      'Manual review of core lending and liquidation logic',
      'Model economic and oracle manipulation attack vectors',
      'Deliver a written report with severity ratings and PoCs',
      'Re-review fixes and sign off before deployment',
    ],
    milestones: [
      { title: 'Initial review + report', amount: 20000, status: 'active' },
      { title: 'Remediation re-review', amount: 8000, status: 'pending' },
    ],
    proposals: 6,
    track: 'web3',
  },
  {
    id: 'agent-inference',
    title: 'On-chain agent framework with verifiable inference',
    companyId: 'nimbus-ai',
    category: 'AI / ML',
    basis: 'milestone',
    budget: 56000,
    currency: 'USDC',
    status: 'open',
    postedAt: '1 day ago',
    duration: '10 weeks',
    location: 'Remote',
    minBuilderScore: 720,
    skills: ['Python', 'PyTorch', 'LangGraph', 'RAG', 'Solidity'],
    summary:
      'Build the orchestration layer for autonomous agents that read on-chain state and settle transactions.',
    description:
      'Nimbus is building agents that transact autonomously. We need an ML engineer comfortable with both agentic frameworks and on-chain integration. Tickets tracked in ClickUp, meetings coordinated via Calendly, and payouts released per milestone through escrow.',
    responsibilities: [
      'Design an agent orchestration graph with tool-calling',
      'Integrate on-chain state reads and transaction settlement',
      'Add verifiable inference proofs for critical decisions',
      'Ship evals and monitoring dashboards',
    ],
    milestones: [
      { title: 'Agent runtime + tools', amount: 22000, status: 'active' },
      { title: 'On-chain integration', amount: 20000, status: 'pending' },
      { title: 'Evals + monitoring', amount: 14000, status: 'pending' },
    ],
    proposals: 9,
    track: 'ai',
  },
  {
    id: 'dapp-dashboard',
    title: 'Frontend for a staking dashboard (React + viem)',
    companyId: 'aurora-labs',
    category: 'Frontend',
    basis: 'hourly',
    budget: 85,
    currency: 'USDC',
    status: 'open',
    postedAt: '3 days ago',
    duration: 'Ongoing',
    location: 'Remote',
    minBuilderScore: 550,
    skills: ['React', 'TypeScript', 'Viem', 'Wagmi', 'Tailwind'],
    summary:
      'Build a polished staking dashboard with wallet connection, live positions, and transaction flows.',
    description:
      'We need a frontend engineer to build our staking dashboard. Clean, accessible UI with real-time position data and smooth transaction UX. Collaboration in our shared workspace, tickets in ClickUp, standups on Slack.',
    responsibilities: [
      'Implement wallet connect and network switching',
      'Build live position and rewards views',
      'Create transaction flows with clear pending/error states',
      'Ensure full accessibility and mobile responsiveness',
    ],
    milestones: [{ title: 'Hourly engagement', amount: 85, status: 'active' }],
    proposals: 18,
    track: 'web3',
  },
  {
    id: 'mlops-pipeline',
    title: 'MLOps pipeline for continuous model retraining',
    companyId: 'nimbus-ai',
    category: 'Backend / DevOps',
    basis: 'fixed',
    budget: 34000,
    currency: 'USDC',
    status: 'open',
    postedAt: '6 days ago',
    duration: '5 weeks',
    location: 'Remote',
    minBuilderScore: 650,
    skills: ['Python', 'MLOps', 'Kubernetes', 'Ray', 'CI/CD'],
    summary:
      'Stand up an automated retraining and deployment pipeline with monitoring and rollback.',
    description:
      'Build our MLOps backbone: automated data validation, retraining triggers, model registry, and safe rollout with rollback. Infra as code, observability, and clear runbooks required.',
    responsibilities: [
      'Automate retraining triggers and data validation',
      'Set up a model registry and versioned deployments',
      'Implement canary rollout and automated rollback',
      'Add drift monitoring and alerting',
    ],
    milestones: [
      { title: 'Pipeline + registry', amount: 20000, status: 'active' },
      { title: 'Rollout + monitoring', amount: 14000, status: 'pending' },
    ],
    proposals: 7,
    track: 'ai',
  },
  {
    id: 'design-system',
    title: 'Design system and brand refresh for a DeFi app',
    companyId: 'ledger-guild',
    category: 'Design',
    basis: 'fixed',
    budget: 18000,
    currency: 'USDC',
    status: 'open',
    postedAt: '1 week ago',
    duration: '4 weeks',
    location: 'Remote',
    minBuilderScore: 500,
    skills: ['Figma', 'Design Systems', 'Branding', 'UI'],
    summary:
      'Create a cohesive design system and refresh the brand for a security-focused product.',
    description:
      'We need a product designer to build a scalable design system and refresh our brand. Deliverables include tokens, components in Figma, and a handoff-ready library.',
    responsibilities: [
      'Audit current UI and define visual language',
      'Build a token-based design system in Figma',
      'Design core components and patterns',
      'Prepare developer handoff documentation',
    ],
    milestones: [
      { title: 'Foundations + tokens', amount: 8000, status: 'active' },
      { title: 'Components + handoff', amount: 10000, status: 'pending' },
    ],
    proposals: 22,
    track: 'web3',
  },
]

// ---------------------------------------------------------------------------
// Workflow steps shown on the /hire page.
// ---------------------------------------------------------------------------
export const WORKFLOW_STEPS = [
  {
    key: 'hire',
    title: 'Hire verified talent',
    desc: 'Browse listed work or post a project. Every builder is backed by a verifiable Builder Score.',
    tools: ['Builder Score', 'On-chain proof'],
  },
  {
    key: 'assign',
    title: 'Assign tickets',
    desc: 'Break work into tickets and track progress in a shared workspace.',
    tools: ['ClickUp', 'Jira', 'GitHub'],
  },
  {
    key: 'meet',
    title: 'Sync & meet',
    desc: 'Schedule kickoffs and standups, chat in channels, and hop on calls without leaving the flow.',
    tools: ['Slack', 'Calendly'],
  },
  {
    key: 'pay',
    title: 'Pay via escrow',
    desc: 'Funds are locked in escrow and released automatically as milestones are approved.',
    tools: ['Escrow', 'Milestones'],
  },
] as const

export const CATEGORIES: JobCategory[] = [
  'Smart Contracts',
  'Security & Audits',
  'Frontend',
  'Backend / DevOps',
  'AI / ML',
  'Design',
  'Product',
]

export const BASIS_LABEL: Record<Basis, string> = {
  hourly: 'Hourly',
  fixed: 'Fixed-price',
  milestone: 'Milestone',
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------
export function getJob(id: string): Job | undefined {
  return jobs.find((j) => j.id === id)
}

export function getCompany(id: string): Company | undefined {
  return companies.find((c) => c.id === id)
}

export function getFreelancer(id: string): Freelancer | undefined {
  return freelancers.find((f) => f.id === id)
}

export function getCompanyJobs(companyId: string): Job[] {
  return jobs.filter((j) => j.companyId === companyId)
}

// ---------------------------------------------------------------------------
// Trust gate: a user can bid only if they are verified, meet the minimum
// Builder Score, and have at least one relevant matching skill.
// ---------------------------------------------------------------------------
export type BidEligibility = {
  eligible: boolean
  scoreOk: boolean
  verifiedOk: boolean
  skillOk: boolean
  matchedSkills: string[]
  missingSkills: string[]
}

export function checkBidEligibility(job: Job, user: Freelancer): BidEligibility {
  const userSkills = new Set(user.skills.map((s) => s.toLowerCase()))
  const matchedSkills = job.skills.filter((s) => userSkills.has(s.toLowerCase()))
  const missingSkills = job.skills.filter((s) => !userSkills.has(s.toLowerCase()))
  const scoreOk = user.builderScore >= job.minBuilderScore
  const verifiedOk = user.verified
  const skillOk = matchedSkills.length > 0
  return {
    eligible: scoreOk && verifiedOk && skillOk,
    scoreOk,
    verifiedOk,
    skillOk,
    matchedSkills,
    missingSkills,
  }
}

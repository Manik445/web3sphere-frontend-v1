'use client'

import { useState } from 'react'
import { Search, Sparkles, Github, Zap, Star, CheckCircle2, Code2, GitBranch, Users, BarChart2, Loader2 } from 'lucide-react'

const MOCK_MATCHES = [
  { name: 'Aria Chen', handle: '@aria.eth', avatar: 'AC', color: '#627EEA', matchScore: 97, compat: 98, skills: ['Solidity', 'Rust', 'DeFi', 'Smart Contracts'], builderScore: 920, verified: true },
  { name: 'Marcus Rivera', handle: '@zk_marcus', avatar: 'MR', color: '#00D2FF', matchScore: 94, compat: 92, skills: ['ZK Proofs', 'Circom', 'Layer 2', 'Security'], builderScore: 880, verified: true },
  { name: 'David Osei', handle: '@david.l2', avatar: 'DO', color: '#F3BA2F', matchScore: 91, compat: 89, skills: ['Move', 'Rust', 'TypeScript', 'AI/ML'], builderScore: 820, verified: true },
  { name: 'Priya Sharma', handle: '@priya.sol', avatar: 'PS', color: '#9945FF', matchScore: 88, compat: 86, skills: ['Anchor', 'Solana', 'Python', 'AI Agents'], builderScore: 840, verified: true },
  { name: 'Kenji Tanaka', handle: '@kenji.nft', avatar: 'KT', color: '#FF6C37', matchScore: 85, compat: 83, skills: ['Solidity', 'NFTs', 'Tokenomics', 'JavaScript'], builderScore: 760, verified: false },
]

const AI_ANALYSIS_STEPS = [
  'Cloning repository…',
  'Analyzing tech stack…',
  'Scanning architecture patterns…',
  'Evaluating code quality…',
  'Matching against 4,200 builder profiles…',
  'Ranking results by compatibility…',
]

export function AITalentMatching() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [results, setResults] = useState(false)

  async function handleAnalyze() {
    if (!url) return
    setLoading(true)
    setResults(false)
    setStep(0)
    for (let i = 0; i < AI_ANALYSIS_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 600))
      setStep(i + 1)
    }
    setLoading(false)
    setResults(true)
  }

  return (
    <section className="relative border-t border-border py-20 md:py-24">
      {/* BG decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5 animate-ai-blink" />
            AI Talent Matching
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Find the Right Builder in{' '}
            <span className="shimmer-text">Under 60 Seconds</span>
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Paste a GitHub repository URL and let our AI analyze the codebase, architecture, and collaboration patterns to instantly match you with the best verified builders.
          </p>
        </div>

        {/* Input */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
            <div className="flex items-center gap-3 p-4">
              <Github className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              <input
                type="url"
                placeholder="https://github.com/yourorg/your-repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {loading ? 'Analyzing…' : 'Analyze Repo'}
              </button>
            </div>

            {/* Analysis steps */}
            {loading && (
              <div className="border-t border-border p-4">
                <div className="space-y-2">
                  {AI_ANALYSIS_STEPS.map((s, i) => (
                    <div key={s} className={`flex items-center gap-2 text-xs transition-opacity ${i < step ? 'text-[var(--success)]' : i === step ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                      {i < step ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : i === step ? (
                        <Loader2 className="h-3.5 w-3.5 flex-shrink-0 animate-spin" />
                      ) : (
                        <div className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-muted-foreground/30" />
                      )}
                      {s}
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(step / AI_ANALYSIS_STEPS.length) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* AI analysis tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[{ icon: Code2, label: 'Tech Stack' }, { icon: GitBranch, label: 'Architecture' }, { icon: BarChart2, label: 'Code Quality' }, { icon: Users, label: 'Team Fit' }].map(({ icon: Ic, label }) => (
              <span key={label} className="flex items-center gap-1 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground">
                <Ic className="h-3 w-3" />{label}
              </span>
            ))}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-10 animate-[reveal-up_0.5s_ease_forwards]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Top 5 Builder Matches</h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Analyzed in 3.6s</span>
            </div>
            <div className="space-y-3">
              {MOCK_MATCHES.map((m, i) => (
                <div key={m.handle} className="group flex items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-all hover:border-primary/30 hover:bg-card">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${m.color}cc, ${m.color}66)` }}>
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground text-sm">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.handle}</span>
                      {m.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">🏗 {m.builderScore}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.skills.map((s) => <span key={s} className="rounded-full bg-secondary/60 px-2 py-0.5 text-xs text-muted-foreground">{s}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-[#F3BA2F] text-[#F3BA2F]" />
                      {m.matchScore}% match
                    </div>
                    <div className="text-xs text-muted-foreground">{m.compat}% compat.</div>
                    <button className="mt-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      Hire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

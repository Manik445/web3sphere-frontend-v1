'use client'

import {
  CalendarCheck,
  CheckCircle2,
  Cloud,
  GitPullRequest,
  LayoutDashboard,
  UserPlus,
} from 'lucide-react'
import { useMode } from '@/components/mode-provider'

const CAPABILITIES = [
  {
    icon: UserPlus,
    title: 'Onboard your workforce',
    desc: 'Invite full-time employees and freelancers into one secure, permissioned workspace.',
  },
  {
    icon: GitPullRequest,
    title: 'Assign & track work',
    desc: 'Route feature requests, bugs, and improvements, then track code and productivity live.',
  },
  {
    icon: Cloud,
    title: 'Controlled dev access',
    desc: 'Grant scoped access to cloud workspaces and virtual machines for each contributor.',
  },
  {
    icon: CalendarCheck,
    title: 'Meetings & calendars',
    desc: 'Schedule standups and reviews with integrated calendars and video conferencing.',
  },
  {
    icon: CheckCircle2,
    title: 'Approvals & payouts',
    desc: 'Review deliverables, approve milestones, and automate freelancer payouts.',
  },
  {
    icon: LayoutDashboard,
    title: 'Full visibility',
    desc: 'Manage many contributors across independent modules with complete accountability.',
  },
]

const INTEGRATIONS = ['ClickUp', 'Jira', 'GitHub', 'Notion']

export function WorkforceSection() {
  const { mode } = useMode()
  const domain = mode === 'web3' ? 'Web3, AI & crypto' : 'AI, ML & crypto'

  return (
    <section id="workforce" className="relative overflow-hidden border-t border-border py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Workforce platform
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            An operating system for building & scaling products
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Web3Sphere lets companies manage distributed engineering teams without juggling a dozen third-party
            tools — turning a hiring platform into a complete operating system for building {domain} products.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className="rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <cap.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{cap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cap.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Works with your existing tools
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {INTEGRATIONS.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-border bg-secondary/40 px-4 py-1.5 text-sm font-medium text-foreground"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

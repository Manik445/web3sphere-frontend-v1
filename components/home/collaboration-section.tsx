'use client'

import {
  CalendarClock,
  Hash,
  Lightbulb,
  MessagesSquare,
  Users2,
  Video,
} from 'lucide-react'
import { useMode } from '@/components/mode-provider'

const CONTENT = {
  web3: {
    body: 'Every project gets a dedicated workspace where founders, employees, contributors, and freelancers build together seamlessly — from protocol design to mainnet launch.',
  },
  ai: {
    body: 'Every project gets a dedicated workspace where founders, employees, contributors, and freelancers build together seamlessly — from dataset curation to production deployment.',
  },
} as const

const SPACES = [
  {
    icon: MessagesSquare,
    title: 'Discussion rooms',
    desc: 'Dedicated spaces for founders, teams, and contributors to align and move fast.',
  },
  {
    icon: Hash,
    title: 'Feature channels',
    desc: 'Organize work into feature-specific channels and technical forums.',
  },
  {
    icon: Lightbulb,
    title: 'Brainstorming spaces',
    desc: 'Live collaboration rooms for ideation, RFCs, and design reviews.',
  },
  {
    icon: CalendarClock,
    title: 'Integrated scheduling',
    desc: 'Plan sessions and community events without leaving the workspace.',
  },
  {
    icon: Video,
    title: 'Video meetings',
    desc: 'Jump into calls with your team and freelancers in one click.',
  },
  {
    icon: Users2,
    title: 'Community events',
    desc: 'Host AMAs, workshops, and demo days that grow your ecosystem.',
  },
]

export function CollaborationSection() {
  const { mode } = useMode()
  const c = CONTENT[mode]

  return (
    <section id="collaboration" className="relative border-t border-border py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Users2 className="h-3.5 w-3.5" />
            Collaboration workspaces
          </span>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Social workspaces where builders ship together
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">{c.body}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPACES.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-border bg-card/40 p-6 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

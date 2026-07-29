import Link from 'next/link'
import { ArrowRight, Briefcase, ClipboardList, CalendarClock, ShieldCheck, ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WORKFLOW_STEPS } from '@/lib/hire-data'

const STEP_ICONS = {
  hire: Briefcase,
  assign: ClipboardList,
  meet: CalendarClock,
  pay: ShieldCheck,
} as const

export function HireHero({ jobCount, talentCount }: { jobCount: number; talentCount: number }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 md:px-6 md:pt-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
            <Briefcase className="h-3.5 w-3.5" />
            Freelance marketplace
          </span>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Hire, coordinate, and pay builders in one flow
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground md:text-lg">
            A marketplace built only for Web3, crypto, and AI teams. Post work, hire verified talent, assign tickets,
            run meetings, and release milestone payments through escrow — without stitching together five tools.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="#board" className={cn(buttonVariants(), 'h-11 gap-2 rounded-full px-5')}>
              Browse open work
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/hire/post"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-11 gap-2 rounded-full px-5')}
            >
              Post a project
            </Link>
            <div className="ml-1 flex items-center gap-5 text-sm text-muted-foreground">
              <span>
                <strong className="font-semibold text-foreground">{jobCount}</strong> open roles
              </span>
              <span>
                <strong className="font-semibold text-foreground">{talentCount}</strong> verified builders
              </span>
            </div>
          </div>
        </div>

        {/* Workflow flow */}
        <div className="mt-12 rounded-3xl border border-border bg-card/50 p-5 glass md:p-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">How work flows</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4 md:gap-0">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[step.key]
              return (
                <div key={step.key} className="relative flex md:block">
                  <div className="flex-1 rounded-2xl border border-border bg-secondary/30 p-4 md:mr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        Step {i + 1}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {step.tools.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[11px] text-foreground/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute right-[-6px] top-1/2 hidden -translate-y-1/2 text-muted-foreground md:block"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

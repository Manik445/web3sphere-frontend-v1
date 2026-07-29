import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Cta() {
  return (
    <section className="relative border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center md:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]"
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Your on-chain reputation starts today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              Join 148,000+ builders shaping the future of Web3, Crypto, and AI. Claim your username, connect your
              wallet, and start earning W3T.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className={cn(buttonVariants(), 'h-12 gap-2 rounded-full px-7 text-base')}
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/payments"
                className={cn(buttonVariants({ variant: 'outline' }), 'h-12 rounded-full px-7 text-base')}
              >
                Try P2P payments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

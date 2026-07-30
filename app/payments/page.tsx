import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { PaymentsClient } from '@/components/payments/payments-client'

export const metadata: Metadata = {
  title: 'Payments · Web3Sphere',
  description:
    'Deposit & withdraw Fiat (UPI, NEFT, RTGS, IMPS) and Crypto (ETH, BTC, SOL, USDC). P2P crypto transfers, escrow, and bill splits — all in one fintech-grade platform.',
}

export default function PaymentsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <CryptoTicker />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-8rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
            <div className="absolute right-[-6rem] top-40 h-[20rem] w-[20rem] rounded-full bg-[var(--chart-4)]/10 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-14 md:px-6 md:pt-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary">
                Payments & Wallet
              </span>
              <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Move money.{' '}
                <span className="shimmer-text">Fiat or crypto.</span>
              </h1>
              <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                Deposit and withdraw Indian Rupees via UPI, NEFT, RTGS, IMPS, or bank transfer. Send crypto to friends
                by username with escrow protection. Professional-grade fintech UX — 24/7 support.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {[
                  'Zero deposit fees',
                  '₹5Cr+ processed monthly',
                  'Bank-grade 256-bit encryption',
                  'Escrow for freelancers',
                ].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 md:px-6">
          <PaymentsClient />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

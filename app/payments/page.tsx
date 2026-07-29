import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { PaymentsClient } from '@/components/payments/payments-client'

export const metadata: Metadata = {
  title: 'P2P Payments · Web3Sphere',
  description:
    'Send, request, and split crypto with friends by username — with live rates and optional escrow. No wallet-address copy-paste required.',
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
          </div>
          <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-14 md:px-6 md:pt-16">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">P2P Payments</span>
              <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Pay a friend, not an address
              </h1>
              <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                Request crypto, split bills, and settle bounties with a username. Live conversion rates keep everyone
                honest, and escrow protects freelance work.
              </p>
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

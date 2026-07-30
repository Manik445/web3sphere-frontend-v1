import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { Hero } from '@/components/home/hero'
import { TrustedBy } from '@/components/home/trusted-by'
import { IdentityShowcase } from '@/components/home/identity-showcase'
import { MarketsSection } from '@/components/home/markets-section'
import { DexRatings } from '@/components/home/dex-ratings'
import { Features } from '@/components/home/features'
import { MarketplaceSection } from '@/components/home/marketplace-section'
import { Cta } from '@/components/home/cta'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <IdentityShowcase />
        <MarketsSection />
        <DexRatings />
        <Features />
        <MarketplaceSection />
        <Cta />
      </main>
      <CryptoTicker />
      <SiteFooter />
    </div>
  )
}

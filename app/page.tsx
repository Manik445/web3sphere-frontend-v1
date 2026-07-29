import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { Hero } from '@/components/home/hero'
import { MarketsSection } from '@/components/home/markets-section'
import { Features } from '@/components/home/features'
import { IdentityShowcase } from '@/components/home/identity-showcase'
import { MarketplaceSection } from '@/components/home/marketplace-section'
import { CollaborationSection } from '@/components/home/collaboration-section'
import { WorkforceSection } from '@/components/home/workforce-section'
import { Cta } from '@/components/home/cta'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <CryptoTicker />
      <main className="flex-1">
        <Hero />
        <MarketsSection />
        <Features />
        <IdentityShowcase />
        <MarketplaceSection />
        <CollaborationSection />
        <WorkforceSection />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}

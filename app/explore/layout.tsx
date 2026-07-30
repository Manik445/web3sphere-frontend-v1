import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import ExplorePage from './page'

export const metadata: Metadata = {
  title: 'Explore · Web3Sphere',
  description:
    'Discover AI Swarm Intelligence, Builder Collaboration Rooms, and the Builder Feed — the discovery hub for Web3 and AI builders.',
}

export default function ExploreLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <CryptoTicker />
      <main className="flex-1">
        <ExplorePage />
      </main>
      <SiteFooter />
    </div>
  )
}

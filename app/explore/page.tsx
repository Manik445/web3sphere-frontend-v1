import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { ExploreClientPage } from '@/components/explore/explore-client'

export const metadata: Metadata = {
  title: 'Explore · Web3Sphere',
  description:
    'Discover AI Swarm Intelligence, Builder Collaboration Rooms, and the Builder Feed — the discovery hub for Web3 and AI builders.',
}

export default function ExplorePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1">
        <ExploreClientPage />
      </main>
    </div>
  )
}

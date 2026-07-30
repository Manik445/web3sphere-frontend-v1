import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { MentorshipClient } from '@/components/mentorship/mentorship-client'

export const metadata: Metadata = {
  title: 'Mentorship · Web3Sphere',
  description:
    'Book 1-on-1 sessions with top Web3 and AI builders. Verified mentors, crypto-native payments, and flexible scheduling.',
}

export default function MentorshipPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <MentorshipClient />
      </main>
      <CryptoTicker />
      <SiteFooter />
    </div>
  )
}

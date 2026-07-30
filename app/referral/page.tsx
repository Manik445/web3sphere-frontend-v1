import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { ReferralClient } from '@/components/referral/referral-client'

export const metadata: Metadata = {
  title: 'Referral · Web3Sphere',
  description: 'Invite builders to Web3Sphere and earn USDC, XP, and exclusive rewards. Track your referrals, leaderboard rank, and pending earnings.',
}

export default function ReferralPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ReferralClient />
      </main>
      <CryptoTicker />
      <SiteFooter />
    </div>
  )
}

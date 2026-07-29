import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { HireHero } from '@/components/hire/hire-hero'
import { JobBoard } from '@/components/hire/job-board'
import { TalentStrip } from '@/components/hire/talent-strip'
import { jobs, freelancers } from '@/lib/hire-data'

export const metadata: Metadata = {
  title: 'Hire · Web3Sphere Freelance Marketplace',
  description:
    'Hire verified Web3, crypto, and AI builders. Post work, assign tickets, run meetings, and release milestone payments through escrow — all in one flow.',
}

export default function HirePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <CryptoTicker />
      <main className="flex-1">
        <HireHero jobCount={jobs.length} talentCount={freelancers.length} />
        <JobBoard />
        <TalentStrip />
      </main>
      <SiteFooter />
    </div>
  )
}

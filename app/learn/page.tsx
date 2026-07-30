import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CryptoTicker } from '@/components/crypto-ticker'
import { LearnClientPage } from '@/components/learn/learn-client'

export const metadata: Metadata = {
  title: 'Learn · Web3Sphere',
  description:
    'Learn Web3, AI agents, smart contracts, ZK proofs and DeFi from verified builders. Earn on-chain NFT badges, XP, and Builder Score when you complete courses. Upload your own content and earn 70% revenue share.',
  keywords: [
    'learn web3',
    'smart contract course',
    'zk proofs tutorial',
    'defi course',
    'ai agent engineering',
    'nft badges',
    'builder score',
    'course marketplace',
  ],
}

export default function LearnPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LearnClientPage />
      </main>
      <CryptoTicker />
      <SiteFooter />
    </div>
  )
}

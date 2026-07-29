import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProfileClient } from '@/components/profile/profile-client'
import { SupportChat } from '@/components/support-chat'

export const metadata: Metadata = {
  title: 'Profile · Web3Sphere',
  description:
    'Your Web3Sphere identity — builder score, payments, transaction requests, and completed history in one place.',
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <ProfileClient />
      </main>
      <SiteFooter />
      <SupportChat />
    </div>
  )
}

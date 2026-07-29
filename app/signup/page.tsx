import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign up · Web3Sphere',
  description: 'Create your on-chain identity on Web3Sphere.',
}

export default function SignupPage() {
  return (
    <AuthShell>
      <SignupForm />
    </AuthShell>
  )
}

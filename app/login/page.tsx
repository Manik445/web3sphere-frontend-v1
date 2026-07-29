import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Log in · Web3Sphere',
  description: 'Sign in to Web3Sphere with your wallet or credentials.',
}

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  )
}

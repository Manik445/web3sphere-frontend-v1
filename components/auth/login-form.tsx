'use client'

import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthAltLink, OrDivider, WalletButtons } from '@/components/auth/auth-shell'
import { authApi } from '@/lib/api/auth'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await authApi.login({ email, password })
      if (res.success && res.data) {
        setDone(true)
        localStorage.setItem('access_token', res.data.tokens.access_token)
        localStorage.setItem('refresh_token', res.data.tokens.refresh_token)
        if (res.data.user?.avatar) {
          localStorage.setItem('user_avatar', res.data.user.avatar)
        }
        window.location.href = '/'
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setDone(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card/70 p-7 glass md:p-8">
      <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Web3Sphere.ID
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Connect a wallet or sign in with your credentials.</p>

      <div className="mt-6">
        <WalletButtons />
      </div>

      <div className="my-6">
        <OrDivider label="Standard protocol" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="font-mono text-[11px] uppercase tracking-widest">
            Identifier
          </Label>
          <Input 
            id="identifier" 
            type="email" 
            required 
            placeholder="user@domain.net" 
            className="h-11" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="passcode" className="font-mono text-[11px] uppercase tracking-widest">
              Passcode
            </Label>
            <button type="button" className="text-xs text-primary hover:underline">
              Forgot?
            </button>
          </div>
          <Input 
            id="passcode" 
            type="password" 
            required 
            placeholder="••••••••••••" 
            className="h-11" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading || done} className="h-12 w-full gap-2 rounded-full text-base">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Initializing uplink
            </>
          ) : done ? (
            'Uplink established'
          ) : (
            <>
              Initialize uplink
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6">
        <AuthAltLink prompt="New to Web3Sphere?" href="/signup" label="Create identity" />
      </div>
    </div>
  )
}

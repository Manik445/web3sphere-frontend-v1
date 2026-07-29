'use client'

import { useState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthAltLink, OrDivider, WalletButtons } from '@/components/auth/auth-shell'
import { authApi } from '@/lib/api/auth'

const PERKS = ['On-chain identity', 'Earn W3T rewards', 'Join builder rooms']

export function SignupForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')
    
    try {
      const res = await authApi.signup({ email, password })
      if (res.success) {
        setDone(true)
        setSuccessMsg(res.message || 'Registration successful. Please check your email for the verification code.')
      }
    } catch (err: any) {
      setError(typeof err.message === 'string' ? err.message : JSON.stringify(err.message) || 'Signup failed')
      setDone(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card/70 p-7 glass md:p-8">
      <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        New identity
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Claim your handle</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Your reputation, portable across the decentralized web.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PERKS.map((perk) => (
          <span
            key={perk}
            className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary"
          >
            <Check className="h-3 w-3" />
            {perk}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <WalletButtons />
      </div>

      <div className="my-6">
        <OrDivider label="Or with email" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-500">
            {successMsg}
          </div>
        )}
        {/* <div className="space-y-1.5">
          <Label htmlFor="handle" className="font-mono text-[11px] uppercase tracking-widest">
            Username
          </Label>
          <div className="flex h-11 items-center rounded-lg border border-input bg-input/30 pl-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <span className="font-mono text-sm text-muted-foreground">@</span>
            <Input
              id="handle"
              required
              placeholder="satoshi"
              className="h-full flex-1 border-0 bg-transparent px-1.5 focus-visible:ring-0"
            />
          </div>
        </div> */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest">
            Email
          </Label>
          <Input 
            id="email" 
            type="email" 
            required 
            placeholder="user@domain.net" 
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest">
            Passcode
          </Label>
          <Input 
            id="password" 
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
              Minting identity
            </>
          ) : done ? (
            'Identity created'
          ) : (
            <>
              Create identity
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
        By continuing you agree to the Web3Sphere Terms and acknowledge the Privacy Policy.
      </p>

      <div className="mt-4">
        <AuthAltLink prompt="Already have an identity?" href="/login" label="Log in" />
      </div>
    </div>
  )
}

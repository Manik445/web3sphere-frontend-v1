import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('group flex items-center gap-2.5', className)}>
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-lg bg-primary/25 blur-md transition-all group-hover:bg-primary/40" />
        <svg viewBox="0 0 32 32" className="relative h-8 w-8" aria-hidden="true">
          <circle cx="16" cy="16" r="14" fill="none" stroke="var(--primary)" strokeWidth="1.5" opacity="0.5" />
          <circle cx="16" cy="16" r="6" fill="var(--primary)" />
          <circle cx="16" cy="2.5" r="2" fill="var(--foreground)" />
          <circle cx="28" cy="23" r="2" fill="var(--foreground)" />
          <circle cx="4" cy="23" r="2" fill="var(--foreground)" />
        </svg>
      </span>
      <span className="font-sans text-lg font-bold tracking-tight text-foreground">
        Web3<span className="text-primary">Sphere</span>
      </span>
    </Link>
  )
}

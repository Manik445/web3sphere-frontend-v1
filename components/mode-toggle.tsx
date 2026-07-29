'use client'

import { Blocks, Brain } from 'lucide-react'
import { useMode, type SphereMode } from '@/components/mode-provider'
import { cn } from '@/lib/utils'

const OPTIONS: { value: SphereMode; label: string; icon: typeof Blocks }[] = [
  { value: 'web3', label: 'Web3', icon: Blocks },
  { value: 'ai', label: 'AI', icon: Brain },
]

export function ModeToggle({ className }: { className?: string }) {
  const { mode, setMode } = useMode()

  return (
    <div
      role="radiogroup"
      aria-label="Choose your track"
      className={cn(
        'relative inline-flex items-center rounded-full border border-border bg-card/60 p-1 glass',
        className,
      )}
    >
      {OPTIONS.map((option) => {
        const active = mode === option.value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(option.value)}
            className={cn(
              'relative z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

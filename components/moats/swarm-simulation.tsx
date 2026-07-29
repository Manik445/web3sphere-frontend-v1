'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

type Agent = {
  x: number
  y: number
  vx: number
  vy: number
  /** -1 (against) .. +1 (for) */
  stance: number
  weight: number
}

const FOR = 'oklch(0.75 0.18 155)'
const AGAINST = 'oklch(0.63 0.2 25)'
const NEUTRAL = 'oklch(0.75 0.17 235)'

function stanceColor(stance: number) {
  if (stance > 0.15) return FOR
  if (stance < -0.15) return AGAINST
  return NEUTRAL
}

export function SwarmSimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const agentsRef = useRef<Agent[]>([])
  const rafRef = useRef(0)
  const runningRef = useRef(true)
  const nudgeRef = useRef(0)

  const [running, setRunning] = useState(true)
  const [consensus, setConsensus] = useState(0)
  const [nudge, setNudge] = useState(0)

  useEffect(() => {
    nudgeRef.current = nudge
  }, [nudge])
  useEffect(() => {
    runningRef.current = running
  }, [running])

  function seed(width: number, height: number) {
    const count = width < 520 ? 90 : 150
    agentsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      stance: (Math.random() - 0.5) * 1.6,
      weight: Math.random() * 0.8 + 0.2,
    }))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      width = parent.clientWidth
      height = parent.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (agentsRef.current.length === 0) seed(width, height)
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    function step() {
      rafRef.current = requestAnimationFrame(step)

      const agents = agentsRef.current
      ctx.clearRect(0, 0, width, height)

      let weightedSum = 0
      let totalWeight = 0
      for (const a of agents) {
        weightedSum += a.stance * a.weight
        totalWeight += a.weight
      }
      const crowd = totalWeight ? weightedSum / totalWeight : 0

      const paused = !runningRef.current
      for (const a of agents) {
        if (!paused) {
          const target = crowd * 0.6 + nudgeRef.current * 0.5
          a.stance += (target - a.stance) * 0.008 + (Math.random() - 0.5) * 0.01
          a.stance = Math.max(-1, Math.min(1, a.stance))
          a.x += a.vx
          a.y += a.vy
          if (a.x < 0 || a.x > width) a.vx *= -1
          if (a.y < 0 || a.y > height) a.vy *= -1
        }
      }

      const maxDist = 96
      for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
          const a = agents[i]
          const b = agents[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < maxDist && Math.sign(a.stance) === Math.sign(b.stance)) {
            ctx.strokeStyle = stanceColor((a.stance + b.stance) / 2)
            ctx.globalAlpha = (1 - dist / maxDist) * 0.28
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 0.95
      for (const a of agents) {
        ctx.fillStyle = stanceColor(a.stance)
        ctx.beginPath()
        ctx.arc(a.x, a.y, 1.6 + a.weight * 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      frame++
      if (frame % 6 === 0) setConsensus(Math.round(crowd * 100))
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function reset() {
    const parent = canvasRef.current?.parentElement
    if (parent) seed(parent.clientWidth, parent.clientHeight)
    setNudge(0)
  }

  const forPct = Math.round((consensus + 100) / 2)
  const againstPct = 100 - forPct

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--success)] pulse-ring" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Live swarm · debate #4821
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNudge((n) => Math.max(-1, +(n - 0.35).toFixed(2)))}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-destructive hover:text-destructive"
          >
            Argue against
          </button>
          <button
            onClick={() => setNudge((n) => Math.min(1, +(n + 0.35).toFixed(2)))}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-[var(--success)] hover:text-[var(--success)]"
          >
            Argue for
          </button>
        </div>
      </div>

      <div className="relative h-[280px] w-full sm:h-[340px]">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute left-4 top-4 rounded-xl border border-border bg-background/70 px-3 py-2 backdrop-blur">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Your influence weight
          </p>
          <p className="text-sm font-bold text-foreground">
            Builder Score 942 · {nudge === 0 ? 'idle' : nudge > 0 ? 'boosting FOR' : 'boosting AGAINST'}
          </p>
        </div>
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-[var(--success)]">FOR · {forPct}%</span>
          <span className="text-muted-foreground">Emergent consensus</span>
          <span className="text-destructive">AGAINST · {againstPct}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-[var(--success)] transition-all duration-500"
            style={{ width: `${forPct}%` }}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary"
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset swarm
          </button>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {agentsRef.current.length || 150} agents active
          </span>
        </div>
      </div>
    </div>
  )
}

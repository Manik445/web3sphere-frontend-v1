'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type Msg = { id: number; role: 'bot' | 'user'; text: string }

const QUICK_REPLIES = [
  'What is Web3Sphere?',
  'How do payments work?',
  'What is the Builder Score?',
  'Tell me about the AI swarm',
]

// Lightweight rule-based assistant. Matches keywords and returns a helpful,
// on-brand reply. No external API required.
function answer(input: string): string {
  const q = input.toLowerCase()

  if (/hi|hello|hey|gm\b/.test(q)) {
    return 'Hey! I\u2019m Sphere Assistant. Ask me about identity, payments, hiring, the Builder Score, or our AI swarm moat.'
  }
  if (/what is|about|web3sphere|platform/.test(q)) {
    return 'Web3Sphere is the workforce infrastructure layer for the decentralized economy \u2014 on-chain identity, community rooms, hiring, live markets, and peer-to-peer crypto payments in one place.'
  }
  if (/payment|pay|p2p|send|money|usdc|escrow|payroll/.test(q)) {
    return 'You can request or send crypto to a username (no copy-pasting wallet addresses), split bills, and use smart-contract escrow for freelance work. Check the Payments page to try it.'
  }
  if (/builder score|reputation|score/.test(q)) {
    return 'The Builder Score is a tamper-proof reputation built from on-chain activity, GitHub history, hackathon wins, DAO votes, and completed platform work. It also sets your influence weight inside AI swarm debates.'
  }
  if (/swarm|predict|debate|ai|agent/.test(q)) {
    return 'Moat 01 \u2014 Predict Future spawns thousands of AI agents for each debate while real users join as reputation-weighted nodes, producing emergent predictions. See the dedicated page at /moats/predict-future.'
  }
  if (/hire|job|freelanc|talent|work/.test(q)) {
    return 'Companies can hire verified Web3, crypto, and AI builders on hourly, fixed, or milestone terms \u2014 every profile is backed by a Builder Score. Head to the Hire section to browse jobs and talent.'
  }
  if (/identity|wallet|login|profile|nft/.test(q)) {
    return 'Your identity is wallet-based: NFTs, POAPs, SBTs, and DAO history form a verifiable on-chain resume you own. Visit your Profile page to see requests and transaction history.'
  }
  if (/price|market|token|w3t|coin/.test(q)) {
    return 'Live market data refreshes on the home page under Live Markets. W3T is the native token that powers tipping, rewards, staking, and P2P payments across the platform.'
  }
  if (/human|support|help|contact|agent/.test(q)) {
    return 'Happy to help here! For account-specific issues, connect your wallet and open a ticket from your Profile page and our team will follow up.'
  }
  return 'Good question! I can help with identity, payments, hiring, the Builder Score, live markets, and our AI swarm moat. Try one of the quick options, or rephrase and I\u2019ll do my best.'
}

let idSeq = 2

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: 'bot',
      text: 'Hi, I\u2019m Sphere Assistant. How can I help you explore Web3Sphere today?',
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: Msg = { id: idSeq++, role: 'user', text: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    // Simulate a brief think for a natural feel.
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: idSeq++, role: 'bot', text: answer(trimmed) }])
      setTyping(false)
    }, 600)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      {/* Panel */}
      <div
        className={cn(
          'fixed bottom-24 right-4 z-50 w-[min(22rem,calc(100vw-2rem))] origin-bottom-right transition-all duration-300 md:right-6',
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
        )}
        role="dialog"
        aria-label="Support chat"
        aria-hidden={!open}
      >
        <div className="flex h-[30rem] max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl glass">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Sphere Assistant</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-bl-md border border-border bg-background/60 text-foreground',
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-background/60 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background/60 pl-4 pr-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Web3Sphere..."
                className="h-10 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Message"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 md:right-6"
        aria-label={open ? 'Close support chat' : 'Open support chat'}
        aria-expanded={open}
      >
        {!open && (
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/40 pulse-ring" />
        )}
        <span className="relative">
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </span>
      </button>
    </>
  )
}

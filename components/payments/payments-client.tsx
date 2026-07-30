'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock,
  FileUp,
  IndianRupee,
  Info,
  Landmark,
  Loader2,
  QrCode,
  Receipt,
  Send,
  ShieldCheck,
  Smartphone,
  Split,
  Upload,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import type { Coin } from '@/app/api/prices/route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetcher, formatUsd } from '@/lib/format'
import { cn } from '@/lib/utils'

type Direction = 'deposit' | 'withdraw'
type Type = 'fiat' | 'crypto'
type P2PMode = 'send' | 'request' | 'split'
type FiatMethod = 'upi' | 'bank' | 'imps' | 'neft' | 'rtgs'
type FiatWithdrawMethod = 'bank' | 'upi'
type Status = 'idle' | 'loading' | 'done'

const P2P_MODES: { id: P2PMode; label: string; icon: typeof Send }[] = [
  { id: 'send', label: 'Send', icon: Send },
  { id: 'request', label: 'Request', icon: ArrowDownLeft },
  { id: 'split', label: 'Split bill', icon: Split },
]

const FRIENDS = [
  { handle: 'vitalik', verified: true },
  { handle: 'anatoly', verified: true },
  { handle: 'gakonst', verified: true },
  { handle: 'punk6529', verified: false },
]

const ACTIVITY = [
  { dir: 'in', handle: 'anatoly', token: 'SOL', amount: 1.5, fiat: null, note: 'Hackathon prize split', time: '2m ago' },
  { dir: 'out', handle: 'vitalik', token: 'ETH', amount: 0.05, fiat: null, note: 'Lost the bet 😅', time: '1h ago' },
  { dir: 'in', handle: 'self', token: null, amount: null, fiat: 25000, note: 'UPI Deposit · Reference #UPI8472', time: 'Yesterday' },
  { dir: 'out', handle: 'self', token: null, amount: null, fiat: 12000, note: 'Bank Withdrawal · SBI ****2891', time: '2 days ago' },
  { dir: 'in', handle: 'gakonst', token: 'ETH', amount: 0.2, fiat: null, note: 'Bounty payout', time: '5h ago' },
  { dir: 'out', handle: 'punk6529', token: 'USDC', amount: 40, fiat: null, note: 'Co-working desk', time: '3 days ago' },
]

const TOKENS = ['ETH', 'BTC', 'SOL', 'BNB', 'USDC']

const FIAT_DEPOSIT_METHODS: { id: FiatMethod; label: string; desc: string; icon: typeof Smartphone; eta: string }[] = [
  { id: 'upi', label: 'UPI', desc: 'Instant deposit via UPI ID', icon: Smartphone, eta: 'Instant · 0-5 min' },
  { id: 'bank', label: 'Bank Transfer', desc: 'NEFT/RTGS/IMPS via netbanking', icon: Building2, eta: 'Same banking day' },
  { id: 'imps', label: 'IMPS', desc: '24/7 immediate transfer', icon: ArrowUpDown, eta: 'Instant · 0-15 min' },
  { id: 'neft', label: 'NEFT', desc: 'Batch settlement, no max limit', icon: Landmark, eta: '2-8 hours' },
  { id: 'rtgs', label: 'RTGS', desc: 'Gross settlement (min ₹2L)', icon: CircleDollarSign, eta: '30 min - 2 hours' },
]

const FIAT_WITHDRAW_METHODS: { id: FiatWithdrawMethod; label: string; desc: string; icon: typeof Banknote; fee: string; limit: string }[] = [
  { id: 'bank', label: 'Linked Bank Account', desc: 'Withdraw directly to linked bank', icon: Landmark, fee: '0.5% + ₹10', limit: '₹50,000 / day' },
  { id: 'upi', label: 'UPI Withdrawal', desc: 'Withdraw instantly to UPI ID', icon: Smartphone, fee: '0.3% (min ₹5)', limit: '₹25,000 / day' },
]

const SUPPORTED_BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'Bank of Baroda', 'Canara', 'Yes Bank', 'IndusInd']

export function PaymentsClient() {
  const { data } = useSWR<{ coins: Coin[] }>('/api/prices', fetcher, { refreshInterval: 60_000 })
  const [direction, setDirection] = useState<Direction>('deposit')
  const [type, setType] = useState<Type>('crypto')
  const [status, setStatus] = useState<Status>('idle')

  // Crypto P2P state
  const [p2pMode, setP2pMode] = useState<P2PMode>('send')
  const [token, setToken] = useState('ETH')
  const [amount, setAmount] = useState('0.05')
  const [recipient, setRecipient] = useState('')
  const [escrow, setEscrow] = useState(false)

  // Fiat Deposit state
  const [fiatDepositMethod, setFiatDepositMethod] = useState<FiatMethod>('upi')
  const [fiatAmount, setFiatAmount] = useState('10000')
  const [upiId, setUpiId] = useState('')
  const [txnRef, setTxnRef] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  // Fiat Withdraw state
  const [fiatWithdrawMethod, setFiatWithdrawMethod] = useState<FiatWithdrawMethod>('bank')
  const [fiatWithdrawAmount, setFiatWithdrawAmount] = useState('5000')
  const [bankAccount, setBankAccount] = useState('')
  const [bankIfsc, setBankIfsc] = useState('')
  const [withdrawUpi, setWithdrawUpi] = useState('')

  const priceMap = useMemo(() => {
    const map: Record<string, number> = { USDC: 1 }
    for (const c of data?.coins ?? []) map[c.symbol] = c.price
    return map
  }, [data])

  const usdValue = (Number(amount) || 0) * (priceMap[token] ?? 0)
  const actionLabel = p2pMode === 'send' ? 'Send now' : p2pMode === 'request' ? 'Request now' : 'Split & request'

  function handleCryptoSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => setStatus('done'), 1200)
    setTimeout(() => setStatus('idle'), 3200)
  }

  function handleFiatSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => setStatus('done'), 1500)
    setTimeout(() => setStatus('idle'), 3500)
  }

  const currentMethod = direction === 'deposit'
    ? FIAT_DEPOSIT_METHODS.find((m) => m.id === fiatDepositMethod)
    : FIAT_WITHDRAW_METHODS.find((m) => m.id === fiatWithdrawMethod)

  return (
    <div className="space-y-6">
      {/* ═══ TOP LEVEL TOGGLES ═══ */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/50 p-4 glass md:flex-row md:items-center md:justify-between md:p-5">
        {/* Direction: Deposit / Withdraw */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:hidden">
            Direction
          </span>
          <div className="grid flex-1 grid-cols-2 gap-1 rounded-2xl border border-border bg-background/40 p-1 md:w-[380px]">
            {[
              { id: 'deposit' as Direction, label: 'Deposit', icon: ArrowDownLeft, sub: 'Add funds' },
              { id: 'withdraw' as Direction, label: 'Withdraw', icon: ArrowUpRight, sub: 'Take out funds' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => { setDirection(d.id); setStatus('idle') }}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  direction === d.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <d.icon className="h-4 w-4" />
                <span className="flex flex-col items-start leading-tight">
                  <span>{d.label}</span>
                  <span className={cn(
                    'text-[10px] font-normal',
                    direction === d.id ? 'text-primary-foreground/70' : 'text-muted-foreground/70',
                  )}>
                    {d.sub}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Type: Fiat / Crypto */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:hidden">
            Currency
          </span>
          <div className="grid flex-1 grid-cols-2 gap-1 rounded-2xl border border-border bg-background/40 p-1 md:w-[260px]">
            {[
              { id: 'fiat' as Type, label: 'Fiat', icon: IndianRupee, sub: 'INR · UPI · Bank' },
              { id: 'crypto' as Type, label: 'Crypto', icon: Wallet, sub: 'ETH · BTC · SOL' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setType(t.id); setStatus('idle') }}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  type === t.id
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <t.icon className="h-4 w-4" />
                <span className="flex flex-col items-start leading-tight">
                  <span>{t.label}</span>
                  <span className={cn(
                    'text-[10px] font-normal',
                    type === t.id ? 'text-secondary-foreground/70' : 'text-muted-foreground/70',
                  )}>
                    {t.sub}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ── LEFT: ACTION PANEL ── */}
        <div className="space-y-6">
          {type === 'crypto' ? (
            <CryptoPanel
              direction={direction}
              p2pMode={p2pMode}
              setP2pMode={setP2pMode}
              token={token}
              setToken={setToken}
              amount={amount}
              setAmount={setAmount}
              recipient={recipient}
              setRecipient={setRecipient}
              escrow={escrow}
              setEscrow={setEscrow}
              usdValue={usdValue}
              priceMap={priceMap}
              status={status}
              actionLabel={actionLabel}
              onSubmit={handleCryptoSubmit}
            />
          ) : direction === 'deposit' ? (
            <FiatDepositPanel
              method={fiatDepositMethod}
              setMethod={setFiatDepositMethod}
              amount={fiatAmount}
              setAmount={setFiatAmount}
              upiId={upiId}
              setUpiId={setUpiId}
              txnRef={txnRef}
              setTxnRef={setTxnRef}
              receiptFile={receiptFile}
              setReceiptFile={setReceiptFile}
              status={status}
              onSubmit={handleFiatSubmit}
            />
          ) : (
            <FiatWithdrawPanel
              method={fiatWithdrawMethod}
              setMethod={setFiatWithdrawMethod}
              amount={fiatWithdrawAmount}
              setAmount={setFiatWithdrawAmount}
              bankAccount={bankAccount}
              setBankAccount={setBankAccount}
              bankIfsc={bankIfsc}
              setBankIfsc={setBankIfsc}
              upiId={withdrawUpi}
              setUpiId={setWithdrawUpi}
              status={status}
              onSubmit={handleFiatSubmit}
            />
          )}
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <div className="space-y-6">
          {/* Balance card */}
          <BalanceCard direction={direction} type={type} usdValue={type === 'crypto' ? usdValue : 0} />

          {/* Method info */}
          {currentMethod && (
            <MethodInfoCard direction={direction} type={type} method={currentMethod} />
          )}

          {/* Friends (for crypto P2P) */}
          {type === 'crypto' && direction === 'deposit' && (
            <div className="rounded-3xl border border-border bg-card/60 p-6 glass">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Friends</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {FRIENDS.map((f) => (
                  <button
                    key={f.handle}
                    type="button"
                    onClick={() => setRecipient(f.handle)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50"
                  >
                    <span className="font-mono text-xs text-muted-foreground">@</span>
                    {f.handle}
                    {f.verified && <Check className="h-3 w-3 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Supported banks (for fiat deposit) */}
          {type === 'fiat' && direction === 'deposit' && (
            <div className="rounded-3xl border border-border bg-card/60 p-6 glass">
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Supported Banks</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {SUPPORTED_BANKS.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {b}
                  </span>
                ))}
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  + 120 more
                </span>
              </div>
            </div>
          )}

          {/* Recent activity */}
          <div className="rounded-3xl border border-border bg-card/60 p-6 glass">
            <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
            <ul className="mt-4 space-y-3">
              {ACTIVITY.map((a, i) => {
                const incoming = a.dir === 'in'
                return (
                  <li key={i} className="flex items-center gap-3">
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                        incoming ? 'bg-[var(--success)]/15 text-[var(--success)]' : 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {incoming ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">
                        {a.handle === 'self' ? (
                          <span className="text-muted-foreground">{a.note.split(' · ')[0]}</span>
                        ) : (
                          <>
                            <span className="text-muted-foreground">@</span>{a.handle}
                          </>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.handle === 'self' ? a.note.split(' · ')[1] ?? '' : a.note}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-sm font-semibold',
                        incoming ? 'text-[var(--success)]' : 'text-foreground',
                      )}>
                        {incoming ? '+' : '-'}
                        {a.token ? (
                          <>{a.amount} {a.token}</>
                        ) : (
                          <>₹{a.fiat?.toLocaleString()}</>
                        )}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">{a.time}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   CRYPTO PANEL — Send/Request/Split or Withdraw
   ════════════════════════════════════════════════ */
function CryptoPanel(props: {
  direction: Direction
  p2pMode: P2PMode
  setP2pMode: (m: P2PMode) => void
  token: string
  setToken: (t: string) => void
  amount: string
  setAmount: (a: string) => void
  recipient: string
  setRecipient: (r: string) => void
  escrow: boolean
  setEscrow: (v: boolean) => void
  usdValue: number
  priceMap: Record<string, number>
  status: Status
  actionLabel: string
  onSubmit: (e: React.FormEvent) => void
}) {
  const {
    direction, p2pMode, setP2pMode, token, setToken, amount, setAmount,
    recipient, setRecipient, escrow, setEscrow, usdValue, priceMap,
    status, actionLabel, onSubmit,
  } = props

  // For withdraw direction — show withdraw form instead of P2P modes
  if (direction === 'withdraw') {
    return (
      <div className="rounded-3xl border border-border bg-card/60 p-6 glass md:p-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <ArrowUpRight className="h-3.5 w-3.5" />
          Crypto Withdrawal
        </div>
        <h2 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
          Withdraw crypto to external wallet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Send supported assets to any on-chain address. Network fees apply.
        </p>

        <div className="mt-6 space-y-6">
          {/* Steps indicator */}
          <StepIndicator steps={['Destination', 'Amount', 'Review & confirm']} current={recipient && amount ? (amount ? 2 : 1) : 0} />

          {/* Destination */}
          <div className="space-y-1.5">
            <Label htmlFor="withdraw-addr" className="font-mono text-[11px] uppercase tracking-widest">
              Recipient address
            </Label>
            <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <Input
                id="withdraw-addr"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                placeholder="0x... or wallet address"
                className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
              />
              <QrCode className="mr-3 h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Info className="h-3 w-3" />
              Always verify the address. Withdrawals are irreversible.
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="withdraw-amount" className="font-mono text-[11px] uppercase tracking-widest">
              Amount
            </Label>
            <div className="rounded-xl border border-input bg-input/30 p-4">
              <div className="flex items-center gap-3">
                <input
                  id="withdraw-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="0.00"
                />
                <div className="flex flex-wrap justify-end gap-1">
                  {TOKENS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setToken(t)}
                      className={cn(
                        'rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-colors',
                        token === t
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/60 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-mono text-sm text-muted-foreground">
                  ≈ {formatUsd(usdValue)}
                  {priceMap[token] ? (
                    <span className="ml-2 text-xs">({token} @ {formatUsd(priceMap[token])})</span>
                  ) : null}
                </p>
                <div className="flex gap-1">
                  {['25%', '50%', '75%', 'Max'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        const max = 10
                        const pct = p === 'Max' ? 1 : parseInt(p) / 100
                        setAmount(String(Number(max * pct).toFixed(6)))
                      }}
                      className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fee summary */}
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <h3 className="text-xs font-semibold text-foreground">Withdrawal summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Network</span>
                <span className="text-foreground">Ethereum (ERC-20)</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Est. gas fee</span>
                <span className="text-foreground">~ $4.20</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Processing time</span>
                <span className="text-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 5-20 min
                </span>
              </div>
              <div className="my-2 h-px bg-border" />
              <div className="flex justify-between font-semibold text-foreground">
                <span>You'll receive</span>
                <span>{amount} {token} ({formatUsd(Math.max(0, usdValue - 4.2))})</span>
              </div>
            </div>
          </div>

          <Button type="submit" onClick={onSubmit} disabled={status !== 'idle' || !recipient} className="h-12 w-full gap-2 rounded-full text-base">
            {status === 'loading' ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing withdrawal</>
            ) : status === 'done' ? (
              <><CheckCircle2 className="h-4 w-4" /> Withdrawal initiated</>
            ) : (
              <>Review & Withdraw <ArrowUpRight className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Deposit direction — existing P2P Send/Request/Split
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 glass md:p-8">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <ArrowDownLeft className="h-3.5 w-3.5" />
        P2P Crypto Payments
      </div>
      <h2 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
        Pay a friend, not an address
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Send crypto instantly by username, or split a bill. No wallet address copy-paste required.
      </p>

      {/* Mode toggle */}
      <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-background/40 p-1.5">
        {P2P_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setP2pMode(m.id)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              p2pMode === m.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <m.icon className="h-4 w-4" />
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-6">
        {/* Steps */}
        <StepIndicator
          steps={p2pMode === 'split' ? ['People', 'Amount', 'Split & send'] : ['Recipient', 'Amount', p2pMode === 'send' ? 'Send' : 'Request']}
          current={recipient && amount ? 2 : recipient ? 1 : 0}
        />

        <div className="space-y-1.5">
          <Label htmlFor="recipient" className="font-mono text-[11px] uppercase tracking-widest">
            {p2pMode === 'request' ? 'Request from' : p2pMode === 'split' ? 'Split with' : 'Recipient'}
          </Label>
          <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <span className="font-mono text-sm text-muted-foreground">@</span>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              placeholder={p2pMode === 'split' ? 'usernames, comma separated' : 'username or wallet address'}
              className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="amount" className="font-mono text-[11px] uppercase tracking-widest">
            {p2pMode === 'split' ? 'Total bill amount' : 'Amount'}
          </Label>
          <div className="rounded-xl border border-input bg-input/30 p-4">
            <div className="flex items-center gap-3">
              <input
                id="amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="0.00"
                aria-label="Amount"
              />
              <div className="flex flex-wrap justify-end gap-1">
                {TOKENS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setToken(t)}
                    className={cn(
                      'rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-colors',
                      token === t
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/60 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-2 font-mono text-sm text-muted-foreground">
              ≈ {formatUsd(usdValue)}
              {priceMap[token] ? (
                <span className="ml-2 text-xs">({token} @ {formatUsd(priceMap[token])})</span>
              ) : null}
            </p>
          </div>
        </div>

        {/* Escrow toggle (only for Send mode) */}
        {p2pMode === 'send' && (
          <button
            type="button"
            onClick={() => setEscrow((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-background/40 p-4 text-left transition-colors hover:border-primary/40"
          >
            <span className="flex items-center gap-3">
              <ShieldCheck className={cn('h-5 w-5', escrow ? 'text-[var(--success)]' : 'text-muted-foreground')} />
              <span>
                <span className="block text-sm font-medium text-foreground">Escrow protection</span>
                <span className="block text-xs text-muted-foreground">Hold funds until work is confirmed</span>
              </span>
            </span>
            <span className={cn('relative h-6 w-11 rounded-full transition-colors', escrow ? 'bg-primary' : 'bg-secondary')}>
              <span className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform',
                escrow ? 'translate-x-[22px]' : 'translate-x-0.5',
              )} />
            </span>
          </button>
        )}

        <Button type="submit" disabled={status !== 'idle' || !recipient} className="h-12 w-full gap-2 rounded-full text-base">
          {status === 'loading' ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Broadcasting transaction</>
          ) : status === 'done' ? (
            <><Check className="h-4 w-4" />{p2pMode === 'request' ? 'Request sent' : 'Transaction confirmed'}</>
          ) : (
            <>{actionLabel} <ArrowUpRight className="h-4 w-4" /></>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Payments are tied to verified Web3Sphere identities — no more copy-pasting wallet addresses.
        </p>
      </form>
    </div>
  )
}

/* ════════════════════════════════════════════════
   FIAT DEPOSIT PANEL
   ════════════════════════════════════════════════ */
function FiatDepositPanel(props: {
  method: FiatMethod
  setMethod: (m: FiatMethod) => void
  amount: string
  setAmount: (a: string) => void
  upiId: string
  setUpiId: (u: string) => void
  txnRef: string
  setTxnRef: (t: string) => void
  receiptFile: File | null
  setReceiptFile: (f: File | null) => void
  status: Status
  onSubmit: (e: React.FormEvent) => void
}) {
  const { method, setMethod, amount, setAmount, upiId, setUpiId, txnRef, setTxnRef, receiptFile, setReceiptFile, status, onSubmit } = props

  const eta = FIAT_DEPOSIT_METHODS.find((m) => m.id === method)?.eta ?? ''
  const amountNum = Number(amount) || 0
  const processingFee = 0
  const credited = amountNum - processingFee

  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 glass md:p-8">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--success)]/30 bg-[var(--success)]/10 px-3 py-1 text-xs font-medium text-[var(--success)]">
        <ArrowDownLeft className="h-3.5 w-3.5" />
        INR Fiat Deposit
      </div>
      <h2 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
        Deposit Indian Rupees
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Add funds using UPI, IMPS, NEFT, RTGS, or Bank Transfer. Typically credited same day.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Steps */}
        <StepIndicator steps={['Method', 'Amount', 'Payment details']} current={amountNum ? 2 : method ? 1 : 0} />

        {/* Payment method selector */}
        <div className="space-y-1.5">
          <Label className="font-mono text-[11px] uppercase tracking-widest">Payment method</Label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {FIAT_DEPOSIT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={cn(
                  'group flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all',
                  method === m.id
                    ? 'border-primary/50 bg-primary/10 ring-1 ring-primary/30'
                    : 'border-border bg-background/30 hover:border-border hover:bg-secondary/40',
                )}
              >
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                  method === m.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground group-hover:text-foreground',
                )}>
                  <m.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className={cn('text-sm font-semibold', method === m.id ? 'text-foreground' : 'text-foreground/90')}>
                    {m.label}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="fiat-amount" className="font-mono text-[11px] uppercase tracking-widest">Amount (INR)</Label>
          <div className="rounded-xl border border-input bg-input/30 p-4">
            <div className="flex items-center gap-3">
              <IndianRupee className="h-7 w-7 flex-shrink-0 text-muted-foreground" />
              <input
                id="fiat-amount"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="0"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[1000, 5000, 10000, 25000, 50000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(v))}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    amountNum === v
                      ? 'border-primary/50 bg-primary/15 text-primary'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground',
                  )}
                >
                  ₹{v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Method-specific form fields */}
        {method === 'upi' ? (
          <div className="space-y-1.5">
            <Label htmlFor="upi-id" className="font-mono text-[11px] uppercase tracking-widest">Your UPI ID (for verification)</Label>
            <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <Input
                id="upi-id"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okicici / yourname@upi"
                className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
              />
            </div>
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Deposit to UPI</span>
                <QrCode className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2 text-lg font-mono font-bold text-primary">web3sphere@paytm</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Complete the UPI payment first, then enter the reference below.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Landmark className="h-4 w-4 text-primary" />
              Bank details for {method.toUpperCase()} transfer
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Account name</p>
                <p className="font-semibold text-foreground">Web3Sphere Technologies Pvt. Ltd.</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Account number</p>
                <p className="font-mono font-semibold text-foreground">7890 1234 5678</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">IFSC Code</p>
                <p className="font-mono font-semibold text-foreground">HDFC0001234</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Branch</p>
                <p className="font-semibold text-foreground">Bangalore · Koramangala</p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction reference */}
        <div className="space-y-1.5">
          <Label htmlFor="txn-ref" className="font-mono text-[11px] uppercase tracking-widest">Transaction reference *</Label>
          <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            <Input
              id="txn-ref"
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
              required
              placeholder="UPI ref / Transaction ID / UTR number"
              className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Enter the exact reference from your bank or UPI app to help us match your deposit.
          </p>
        </div>

        {/* Upload receipt */}
        <div className="space-y-1.5">
          <Label className="font-mono text-[11px] uppercase tracking-widest">Upload receipt (optional)</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background/30 p-6 transition-colors hover:border-primary/40 hover:bg-primary/5">
            {receiptFile ? (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--success)]/15 text-[var(--success)]">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{receiptFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(receiptFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setReceiptFile(null) }}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF · Max 5 MB</p>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  className="hidden"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                />
              </>
            )}
          </label>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Deposit amount</span>
              <span className="text-foreground font-mono">₹{amountNum.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Processing fee</span>
              <span className="text-[var(--success)] font-medium">Free</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Est. completion</span>
              <span className="text-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{eta}</span>
            </div>
            <div className="my-2 h-px bg-border" />
            <div className="flex justify-between font-semibold text-foreground">
              <span>Credited to your wallet</span>
              <span>₹{credited.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={status !== 'idle' || !txnRef || !amountNum} className="h-12 w-full gap-2 rounded-full text-base">
          {status === 'loading' ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Verifying deposit details</>
          ) : status === 'done' ? (
            <><CheckCircle2 className="h-4 w-4" /> Deposit submitted</>
          ) : (
            <>Submit Deposit <ChevronRight className="h-4 w-4" /></>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Deposits are usually processed within the estimated window. Reference # is used to match your payment.
        </p>
      </form>
    </div>
  )
}

/* ════════════════════════════════════════════════
   FIAT WITHDRAW PANEL
   ════════════════════════════════════════════════ */
function FiatWithdrawPanel(props: {
  method: FiatWithdrawMethod
  setMethod: (m: FiatWithdrawMethod) => void
  amount: string
  setAmount: (a: string) => void
  bankAccount: string
  setBankAccount: (b: string) => void
  bankIfsc: string
  setBankIfsc: (b: string) => void
  upiId: string
  setUpiId: (u: string) => void
  status: Status
  onSubmit: (e: React.FormEvent) => void
}) {
  const { method, setMethod, amount, setAmount, bankAccount, setBankAccount, bankIfsc, setBankIfsc, upiId, setUpiId, status, onSubmit } = props

  const amountNum = Number(amount) || 0
  const feePct = method === 'bank' ? 0.005 : 0.003
  const minFee = method === 'upi' ? 5 : 10
  const fee = Math.max(minFee, Math.round(amountNum * feePct))
  const receive = Math.max(0, amountNum - fee)
  const limit = method === 'bank' ? '₹50,000 / day' : '₹25,000 / day'
  const methodInfo = FIAT_WITHDRAW_METHODS.find((m) => m.id === method)!

  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 glass md:p-8">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-chart-4/30 bg-chart-4/10 px-3 py-1 text-xs font-medium" style={{ color: 'var(--chart-4)' }}>
        <ArrowUpRight className="h-3.5 w-3.5" />
        INR Fiat Withdrawal
      </div>
      <h2 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
        Withdraw to your bank or UPI
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Convert balance to INR and withdraw to linked bank accounts or UPI ID.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <StepIndicator steps={['Method', 'Amount', 'Destination']} current={amountNum ? 2 : method ? 1 : 0} />

        {/* Method */}
        <div className="space-y-1.5">
          <Label className="font-mono text-[11px] uppercase tracking-widest">Withdrawal method</Label>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {FIAT_WITHDRAW_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={cn(
                  'group flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                  method === m.id
                    ? 'border-primary/50 bg-primary/10 ring-1 ring-primary/30'
                    : 'border-border bg-background/30 hover:border-border hover:bg-secondary/40',
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
                  method === m.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground group-hover:text-foreground',
                )}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-semibold', method === m.id ? 'text-foreground' : 'text-foreground/90')}>
                    {m.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{m.desc}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px]">
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/50 px-2 py-0.5 text-muted-foreground">
                      Fee: {m.fee}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/50 px-2 py-0.5 text-muted-foreground">
                      Limit: {m.limit}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="withdraw-amount" className="font-mono text-[11px] uppercase tracking-widest">Withdrawal amount (INR)</Label>
          <div className="rounded-xl border border-input bg-input/30 p-4">
            <div className="flex items-center gap-3">
              <IndianRupee className="h-7 w-7 flex-shrink-0 text-muted-foreground" />
              <input
                id="withdraw-amount"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="min-w-0 flex-1 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="0"
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {[1000, 5000, 10000, 25000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(String(v))}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      amountNum === v
                        ? 'border-primary/50 bg-primary/15 text-primary'
                        : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    ₹{v.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Wallet className="h-3 w-3" />
                Available balance:
                <span className="font-semibold text-foreground">₹1,28,740</span>
              </div>
            </div>
          </div>
        </div>

        {/* Destination fields */}
        {method === 'bank' ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="bank-ac" className="font-mono text-[11px] uppercase tracking-widest">Bank account number *</Label>
              <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <Landmark className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="bank-ac"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  placeholder="Enter your 10-18 digit a/c number"
                  className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ifsc" className="font-mono text-[11px] uppercase tracking-widest">IFSC Code *</Label>
              <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="ifsc"
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  required
                  placeholder="e.g. HDFC0001234"
                  maxLength={11}
                  className="h-full flex-1 border-0 bg-transparent px-2 font-mono uppercase text-base focus-visible:ring-0"
                />
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <p className="text-[11px] text-muted-foreground">
                  💡 For faster withdrawals,{' '}
                  <span className="font-semibold text-primary cursor-pointer hover:underline">link your bank once</span>{' '}
                  and skip entering details every time.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="withdraw-upi" className="font-mono text-[11px] uppercase tracking-widest">UPI ID *</Label>
            <div className="flex h-12 items-center rounded-xl border border-input bg-input/30 pl-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <Input
                id="withdraw-upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
                placeholder="yourname@upi"
                className="h-full flex-1 border-0 bg-transparent px-2 text-base focus-visible:ring-0"
              />
            </div>
          </div>
        )}

        {/* Status tracking (live example) */}
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Expected timeline
          </h3>
          <ol className="mt-3 space-y-3 text-sm">
            {[
              { label: 'Request submitted', time: 'Now', done: false },
              { label: 'Anti-fraud review', time: '0-30 min', done: false },
              { label: method === 'bank' ? 'Bank / NEFT processing' : 'UPI instant credit', time: methodInfo.fee.includes('0.5') ? '2-4 hours' : '0-15 min', done: false },
              { label: 'Funds credited to your account', time: 'Done', done: false },
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={cn(
                  'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                  i === 0 ? 'border-primary/50 bg-primary/20 text-primary' : 'border-border text-muted-foreground',
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={i === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}>{s.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{s.time}</span>
                  </div>
                  {i < 3 && <div className="mt-2 ml-2 h-3 w-px bg-border" />}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Withdrawal amount</span>
              <span className="text-foreground font-mono">₹{amountNum.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Processing fee ({(feePct * 100).toFixed(1)}%, min ₹{minFee})</span>
              <span className="text-foreground font-mono">₹{fee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Daily limit</span>
              <span className="text-foreground">{limit}</span>
            </div>
            <div className="my-2 h-px bg-border" />
            <div className="flex justify-between font-semibold text-foreground">
              <span>You receive</span>
              <span>₹{receive.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={status !== 'idle' || !amountNum || (method === 'bank' ? (!bankAccount || !bankIfsc) : !upiId)} className="h-12 w-full gap-2 rounded-full text-base">
          {status === 'loading' ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Initiating withdrawal</>
          ) : status === 'done' ? (
            <><CheckCircle2 className="h-4 w-4" /> Withdrawal request submitted</>
          ) : (
            <>Confirm & Withdraw <ArrowUpRight className="h-4 w-4" /></>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          For security, first-time withdrawals require additional verification. You'll receive an email confirmation.
        </p>
      </form>
    </div>
  )
}

/* ════════════════════════════════════════════════
   Shared sub-components
   ════════════════════════════════════════════════ */
function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-2">
          <div className={cn(
            'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors',
            i <= current
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-muted-foreground',
          )}>
            {i <= current ? <Check className="h-3 w-3" /> : i + 1}
          </div>
          <span className={cn(
            'hidden min-w-0 flex-1 truncate text-[11px] md:block',
            i <= current ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={cn(
              'hidden h-px flex-1 md:block',
              i < current ? 'bg-primary/60' : 'bg-border',
            )} />
          )}
        </li>
      ))}
    </ol>
  )
}

function BalanceCard({ direction, type, usdValue }: { direction: Direction; type: Type; usdValue: number }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card/70 to-card p-6 glass">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Wallet balance</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Verified
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <IndianRupee className="h-6 w-6 text-muted-foreground" />
          <span className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">1,28,740</span>
        </div>
        <p className="mt-1 font-mono text-sm text-muted-foreground">≈ $1,548.20 USD</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-background/40 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">BTC</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">0.324</p>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">ETH</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">4.82</p>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">USDC</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">2,340</p>
          </div>
        </div>

        {direction === 'deposit' && type === 'crypto' && usdValue > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs">
            <span className="text-primary">This transaction</span>
            <span className="font-semibold text-foreground">{formatUsd(usdValue)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

type AnyMethod = typeof FIAT_DEPOSIT_METHODS[number] | typeof FIAT_WITHDRAW_METHODS[number]

function MethodInfoCard({ direction, type, method }: { direction: Direction; type: Type; method: AnyMethod }) {
  if (type === 'crypto') {
    return (
      <div className="rounded-3xl border border-border bg-card/60 p-6 glass">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Secure by design</h2>
        </div>
        <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
          {[
            'All transactions are on-chain verifiable',
            'Escrow protection available for Send',
            'Multi-sig cold storage for user funds',
            'Verified identity layer prevents fraud',
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[var(--success)]" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const isDeposit = direction === 'deposit'
  const m = method as any
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 glass">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">About {m.label}</h2>
      </div>
      <div className="mt-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Est. completion</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Clock className="h-3 w-3" />
            {m.eta ?? (isDeposit ? 'Same day' : '0-4 hours')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{isDeposit ? 'Fee' : 'Fees'}</span>
          <span className="font-medium text-[var(--success)]">{m.fee ?? 'Free'}</span>
        </div>
        {m.limit && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Daily limit</span>
            <span className="font-medium text-foreground">{m.limit}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Support</span>
          <span className="font-medium text-foreground">24/7 · Live chat</span>
        </div>
      </div>
    </div>
  )
}

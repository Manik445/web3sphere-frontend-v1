'use client'

/**
 * Notification Panel
 * ─────────────────────────────────────────────────────────────────────────────
 * Bell icon + badge + dropdown.
 *
 * Sorting & priority rules (see lib/api/notifications.ts for source):
 *   (1) Actor is a MUTUAL FRIEND → bumped one tier above its kind baseline.
 *   (2) Tier order: payment_due → payment_request → swarm_initiated →
 *       swarm_invite → friend_request → payment_received → payment_declined →
 *       mention → reaction → system.
 *   (3) Inside a tier: newest first.
 *
 * Example consequences:
 *   • Payment request from a mutual friend → appears BEFORE a regular payment-due
 *     item (since mutual bump = effectively tier payment_request - 1, tying the
 *     lowest tier; payment_due still wins on raw tier).
 *   • Swarm started by mutual → treated as tier 1 (same as payment_request
 *     from a non-mutual) so it surfaces prominently.
 */

import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  CheckCheck,
  Clock,
  Coins,
  UsersRound,
  UserPlus,
  ThumbsUp,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  X,
  MessageCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  fetchNotifications,
  markAllRead,
  markNotificationRead,
  formatRelativeTime,
  getUnreadCount,
  type Notification,
  type NotificationKind,
} from '@/lib/api/notifications'

const kindIcon: Record<NotificationKind, React.ComponentType<{ className?: string }>> = {
  payment_request: Coins,
  payment_due: Clock,
  swarm_initiated: UsersRound,
  swarm_invite: UsersRound,
  friend_request: UserPlus,
  payment_received: Coins,
  payment_declined: AlertTriangle,
  mention: MessageCircle,
  reaction: ThumbsUp,
  system: Sparkles,
}

const kindToneClass: Record<string, string> = {
  urgent: 'bg-rose-500/15 text-rose-400 ring-rose-500/30',
  warning: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  info: 'bg-sky-500/15 text-sky-400 ring-sky-500/30',
  default: 'bg-muted text-muted-foreground ring-border',
}

const accentPillClass: Record<string, string> = {
  urgent: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  info: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  default: 'bg-muted text-muted-foreground border-border',
}

const kindLabel: Record<NotificationKind, string> = {
  payment_request: 'Payment Request',
  payment_due: 'Payment Due',
  swarm_initiated: 'Swarm',
  swarm_invite: 'Invite',
  friend_request: 'Friend Request',
  payment_received: 'Received',
  payment_declined: 'Declined',
  mention: 'Mention',
  reaction: 'Reaction',
  system: 'System',
}

function Avatar({ notification }: { notification: Notification }) {
  if (notification.actor?.avatarUrl) {
    return (
      <div
        className="h-9 w-9 rounded-full bg-cover bg-center shrink-0 ring-2 ring-border"
        style={{ backgroundImage: `url(${notification.actor.avatarUrl})` }}
        aria-label={notification.actor.displayName || notification.actor.handle}
      />
    )
  }
  const emoji = notification.actor?.avatarEmoji
  const Icon = kindIcon[notification.kind]
  const tone = kindToneClass[notification.tone]
  return (
    <div
      className={cn(
        'h-9 w-9 rounded-full ring-1 flex items-center justify-center shrink-0',
        emoji ? 'bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-fuchsia-500/20 ring-fuchsia-500/30' : tone
      )}
    >
      {emoji ? (
        <span className="text-base leading-none">{emoji}</span>
      ) : (
        <Icon className="h-4 w-4" />
      )}
    </div>
  )
}

function MutualFriendChip({ actor }: { actor: Notification['actor'] }) {
  if (!actor?.isMutualFriend) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/40 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-300">
      <UsersRound className="h-3 w-3" />
      Mutual
    </span>
  )
}

function RowItem({
  item,
  onOpen,
}: {
  item: Notification
  onOpen: (id: string, href?: string) => void
}) {
  const accent = accentPillClass[item.tone]
  return (
    <button
      type="button"
      onClick={() => onOpen(item.id, item.metadata?.href)}
      className={cn(
        'group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all',
        item.read
          ? 'hover:bg-secondary/60'
          : 'bg-gradient-to-r from-primary/8 via-primary/4 to-transparent hover:from-primary/12 hover:to-transparent'
      )}
    >
      <div className="relative">
        <Avatar notification={item} />
        {!item.read && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn('rounded-full border px-1.5 py-0.5 text-[10px] font-medium', accent)}>
            {kindLabel[item.kind]}
          </span>
          <MutualFriendChip actor={item.actor} />
          {item.tone === 'urgent' && !item.read && (
            <span className="inline-flex items-center rounded-full border border-rose-500/40 bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-300">
              Urgent
            </span>
          )}
        </div>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {item.actor?.displayName || item.actor?.handle ? (
              <>
                <span className="text-foreground">
                  {item.actor.displayName || `@${item.actor.handle}`}
                </span>
                <span className="text-muted-foreground"> · </span>
                <span className="text-foreground">{item.title}</span>
              </>
            ) : (
              item.title
            )}
          </p>
          <span className="shrink-0 text-[10px] font-mono text-muted-foreground">
            {formatRelativeTime(item.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item.body}
        </p>
        {item.metadata?.amount && (
          <div className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-foreground">
            <Coins className="h-3 w-3 text-muted-foreground" />
            {item.metadata.amount} {item.metadata.currency}
          </div>
        )}
      </div>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}

export function NotificationBell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  async function load() {
    setLoading(true)
    try {
      setItems(await fetchNotifications())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const unread = getUnreadCount(items)

  async function openItem(id: string, href?: string) {
    const next = await markNotificationRead(id)
    setItems(next)
    if (href) {
      setOpen(false)
      window.location.href = href
    }
  }

  async function handleMarkAll() {
    setItems(await markAllRead())
  }

  return (
    <div ref={ref} className={cn('relative shrink-0', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Notifications · ${unread} unread`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative h-10 w-10 rounded-full shrink-0"
      >
        <Bell className={cn('h-5 w-5 transition-transform', open && 'scale-105')} />
        {unread > 0 && (
          <span
            className={cn(
              'absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-background shadow-lg shadow-rose-500/30',
              unread > 99 && 'px-1.5'
            )}
          >
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[360px] sm:w-[400px] origin-top-right animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="h-5 w-5 text-primary" />
                  {unread > 0 && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-rose-500" />
                  )}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  <p className="text-[11px] text-muted-foreground">
                    {unread === 0
                      ? 'All caught up ✨'
                      : `${unread} new · Mutual-friend items pinned first`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleMarkAll}
                    className="h-8 gap-1 rounded-full px-3 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    All read
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col gap-3 p-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-start gap-3 rounded-xl p-3"
                    >
                      <div className="h-9 w-9 rounded-full bg-border/60 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 rounded bg-border/60" />
                        <div className="h-3 w-full rounded bg-border/40" />
                        <div className="h-3 w-2/3 rounded bg-border/40" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">No notifications</p>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                    When someone requests a payment, starts a swarm, or adds you —
                    it shows up here. Mutual-friend activity appears at the top.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 p-2">
                  {items.map((n) => (
                    <RowItem key={n.id} item={n} onOpen={openItem} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/80 bg-muted/30 px-4 py-2.5">
              <p className="text-[11px] text-muted-foreground">
                Ordered by mutuals · urgency · time
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setOpen(false)
                  window.location.href = '/notifications'
                }}
              >
                View all
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

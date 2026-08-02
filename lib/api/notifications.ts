/**
 * Notifications API & Types
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side notifications gateway for:
 *   - Peer-to-peer payment requests
 *   - Payment-due reminders
 *   - Swarm (project / squad) kickoffs
 *   - Community reactions, friend requests, airdrops
 *
 * Priority:
 *   MUTUAL_FRIEND (top) > PAYMENT_DUE > PAYMENT_REQUEST > SWARM > DEFAULT
 *   Within a tier we sort by `createdAt` desc so newest urgent items are first.
 *
 * When wired to a Go backend replace `fetchNotifications` with a real call.
 * Mock data is used below to ship UI-first without the API being live.
 */

export type NotificationKind =
  | 'payment_request'
  | 'payment_due'
  | 'swarm_initiated'
  | 'friend_request'
  | 'payment_received'
  | 'payment_declined'
  | 'swarm_invite'
  | 'reaction'
  | 'mention'
  | 'system'

export type NotificationTone =
  | 'info'
  | 'success'
  | 'warning'
  | 'urgent'
  | 'default'

export interface NotificationActor {
  id: string
  handle: string
  displayName?: string
  avatarEmoji?: string
  avatarUrl?: string
  isMutualFriend?: boolean
}

export interface Notification {
  id: string
  kind: NotificationKind
  tone: NotificationTone
  title: string
  body: string
  read: boolean
  createdAt: number
  actor?: NotificationActor
  metadata?: {
    amount?: string
    currency?: string
    swarmId?: string
    swarmName?: string
    dueAt?: number
    href?: string
  }
}

const MOCK_FRIENDS: NotificationActor[] = [
  { id: 'u1', handle: 'arv', displayName: 'Arvind K.', avatarEmoji: '🧑‍💻', isMutualFriend: true },
  { id: 'u2', handle: 'maya', displayName: 'Maya S.', avatarEmoji: '🎨', isMutualFriend: true },
  { id: 'u3', handle: 'kenji', displayName: 'Kenji T.', avatarEmoji: '🛰️', isMutualFriend: true },
  { id: 'u4', handle: 'prisha', displayName: 'Prisha R.', avatarEmoji: '🔬', isMutualFriend: true },
  { id: 'u5', handle: 'leo', displayName: 'Leo M.', avatarEmoji: '🎸', isMutualFriend: false },
  { id: 'u6', handle: 'nora', displayName: 'Nora V.', avatarEmoji: '☕️', isMutualFriend: false },
]

const NOW = Date.now()
const MIN = 60 * 1000
const HR = 60 * MIN

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n_payreq_maya',
    kind: 'payment_request',
    tone: 'urgent',
    title: 'Payment Request',
    body: 'Maya requested ₹2,400 for Friday design sprint retainer.',
    read: false,
    createdAt: NOW - 2 * MIN,
    actor: MOCK_FRIENDS[1],
    metadata: { amount: '2400', currency: 'INR', href: '/payments?request=n_payreq_maya' },
  },
  {
    id: 'n_due_arv',
    kind: 'payment_due',
    tone: 'warning',
    title: 'Payment Due Today',
    body: 'Arvind is waiting on ₹6,800 for mentoring (3 sessions).',
    read: false,
    createdAt: NOW - 12 * MIN,
    actor: MOCK_FRIENDS[0],
    metadata: { amount: '6800', currency: 'INR', dueAt: NOW + 6 * HR, href: '/payments?due=n_due_arv' },
  },
  {
    id: 'n_swarm_kenji',
    kind: 'swarm_initiated',
    tone: 'info',
    title: 'Swarm Launched',
    body: 'Kenji started a swarm · “ZK Login PoC” — join as Solidity dev.',
    read: false,
    createdAt: NOW - 34 * MIN,
    actor: MOCK_FRIENDS[2],
    metadata: { swarmId: 'sw_zklogin', swarmName: 'ZK Login PoC', href: '/swarms/sw_zklogin' },
  },
  {
    id: 'n_swarm_invite_prisha',
    kind: 'swarm_invite',
    tone: 'info',
    title: 'Swarm Invite',
    body: 'Prisha invited you to “Airdrop Claims Dashboard” — Frontend role.',
    read: false,
    createdAt: NOW - 2 * HR,
    actor: MOCK_FRIENDS[3],
    metadata: { swarmId: 'sw_airdrop', swarmName: 'Airdrop Claims Dashboard', href: '/swarms/sw_airdrop' },
  },
  {
    id: 'n_paid_leo',
    kind: 'payment_received',
    tone: 'success',
    title: 'Payment Received',
    body: 'Leo sent you 0.024 ETH (review: Smart-Contract audit).',
    read: true,
    createdAt: NOW - 5 * HR,
    actor: MOCK_FRIENDS[4],
    metadata: { amount: '0.024', currency: 'ETH', href: '/payments' },
  },
  {
    id: 'n_fr_nora',
    kind: 'friend_request',
    tone: 'default',
    title: 'Friend Request',
    body: 'Nora wants to connect · has 2 mutuals in Builder DAO.',
    read: false,
    createdAt: NOW - 8 * HR,
    actor: MOCK_FRIENDS[5],
    metadata: { href: '/profile/nora' },
  },
  {
    id: 'n_declined',
    kind: 'payment_declined',
    tone: 'warning',
    title: 'Payment Declined',
    body: 'Your ₹350 UPI transfer to a service was declined. Retry.',
    read: true,
    createdAt: NOW - 12 * HR,
    metadata: { amount: '350', currency: 'INR', href: '/payments' },
  },
  {
    id: 'n_mention',
    kind: 'mention',
    tone: 'info',
    title: 'You were mentioned',
    body: 'Maya mentioned you in “Sprint kickoff notes”.',
    read: true,
    createdAt: NOW - 18 * HR,
    actor: MOCK_FRIENDS[1],
  },
]

export const PRIORITY_TIER: Record<NotificationKind, number> = {
  payment_due: 0,
  payment_request: 1,
  swarm_initiated: 2,
  swarm_invite: 3,
  friend_request: 4,
  payment_received: 5,
  payment_declined: 6,
  mention: 7,
  reaction: 8,
  system: 9,
}

/**
 * Sort predicate:
 *   (1) Mutual-friend actor bumps the priority up one tier (lower tier is higher).
 *   (2) Then by configured priority tier.
 *   (3) Then newest first.
 */
export function sortNotifications(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    const tierA = PRIORITY_TIER[a.kind] - (a.actor?.isMutualFriend ? 1 : 0)
    const tierB = PRIORITY_TIER[b.kind] - (b.actor?.isMutualFriend ? 1 : 0)
    if (tierA !== tierB) return tierA - tierB
    return b.createdAt - a.createdAt
  })
}

export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < MIN) return 'just now'
  if (diff < HR) return `${Math.floor(diff / MIN)}m ago`
  if (diff < 24 * HR) return `${Math.floor(diff / HR)}h ago`
  const days = Math.floor(diff / (24 * HR))
  return days === 1 ? '1d ago' : `${days}d ago`
}

/**
 * Fetch notifications. Swap this out for a real `fetch('/api/v1/notifications')`
 * call once the Go handler is live. For now returns sorted mock data.
 */
export async function fetchNotifications(): Promise<Notification[]> {
  if (typeof window === 'undefined') return []
  const stored = window.localStorage.getItem('ws_notifications_v1')
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Notification[]
      if (Array.isArray(parsed) && parsed.length) return sortNotifications(parsed)
    } catch {}
  }
  return sortNotifications(MOCK_NOTIFICATIONS)
}

export async function markNotificationRead(id: string): Promise<Notification[]> {
  const all = await fetchNotifications()
  const next = sortNotifications(all.map((n) => (n.id === id ? { ...n, read: true } : n)))
  window.localStorage.setItem('ws_notifications_v1', JSON.stringify(next))
  return next
}

export async function markAllRead(): Promise<Notification[]> {
  const all = await fetchNotifications()
  const next = sortNotifications(all.map((n) => ({ ...n, read: true })))
  window.localStorage.setItem('ws_notifications_v1', JSON.stringify(next))
  return next
}

export async function resetNotificationsMock(): Promise<Notification[]> {
  window.localStorage.removeItem('ws_notifications_v1')
  return sortNotifications(MOCK_NOTIFICATIONS)
}

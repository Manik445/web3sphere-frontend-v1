export function formatUsd(value: number): string {
  if (value >= 1) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    })
  }
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
  })
}

export function formatCompact(value: number): string {
  return value.toLocaleString('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  })
}

export function formatPct(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Safe SWR fetcher.
 * - Absorbs network / TypeError ("Failed to fetch") so console stays clean.
 * - Handles responses that are not `ok` without throwing a generic TypeError.
 * - Returns `null` on failure — SWR will fall back to initialData (typically
 *   an empty array / mock) and the component won't see a crashing error.
 */
export async function fetcher<T = any>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const controller =
      typeof AbortController !== 'undefined' ? new AbortController() : undefined
    const timeoutId = controller
      ? setTimeout(() => controller.abort(), 8000)
      : undefined
    try {
      const r = await fetch(url, { ...init, signal: controller?.signal })
      if (timeoutId) clearTimeout(timeoutId)
      if (!r.ok) return null
      const ct = r.headers.get('content-type') || ''
      if (!ct.includes('application/json')) return null as any
      const json = await r.json()
      return json as T
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  } catch {
    /** TypeError: Failed to fetch (offline, CORS, abort, unreachable backend). */
    return null
  }
}

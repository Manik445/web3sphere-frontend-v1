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

export const fetcher = (url: string) => fetch(url).then((r) => r.json())

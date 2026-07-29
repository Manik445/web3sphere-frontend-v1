import { NextResponse } from 'next/server'

// Live crypto market data from the free CoinGecko API.
const COINS = [
  'bitcoin',
  'ethereum',
  'solana',
  'binancecoin',
  'ripple',
  'cardano',
  'dogecoin',
  'polkadot',
  'chainlink',
  'avalanche-2',
  'polygon-ecosystem-token',
  'arbitrum',
]

export type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  price: number
  change24h: number
  marketCap: number
}

// Fallback data so the UI always renders even if the upstream API is rate-limited.
const FALLBACK: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', image: '', price: 68240, change24h: 1.8, marketCap: 1.34e12 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', image: '', price: 3560, change24h: 2.4, marketCap: 4.28e11 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', image: '', price: 172, change24h: -0.9, marketCap: 7.9e10 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', image: '', price: 605, change24h: 0.6, marketCap: 9.1e10 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', image: '', price: 0.62, change24h: -1.2, marketCap: 3.4e10 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', image: '', price: 0.45, change24h: 3.1, marketCap: 1.6e10 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', image: '', price: 0.16, change24h: 4.5, marketCap: 2.3e10 },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', image: '', price: 14.2, change24h: 1.1, marketCap: 8.8e9 },
]

export async function GET() {
  try {
    const url =
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(',')}` +
      `&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h`

    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`)

    const data = (await res.json()) as any[]
    const coins: Coin[] = data.map((c) => ({
      id: c.id,
      symbol: (c.symbol as string).toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      change24h: c.price_change_percentage_24h ?? 0,
      marketCap: c.market_cap ?? 0,
    }))

    return NextResponse.json({ coins, source: 'live' })
  } catch (error) {
    return NextResponse.json({ coins: FALLBACK, source: 'fallback' })
  }
}

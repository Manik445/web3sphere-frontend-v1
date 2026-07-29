import Link from 'next/link'
import { Logo } from '@/components/logo'

const COLUMNS = [
  {
    title: 'Platform',
    links: ['Community Hub', 'On-Chain Identity', 'Q&A Forum', 'Mentorship'],
  },
  {
    title: 'Markets',
    links: ['Live Prices', 'DEX Ratings', 'Wallet Lookup', 'AI Feed'],
  },
  {
    title: 'Company',
    links: ['About', 'W3T Token', 'Roadmap', 'Careers'],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-6">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            The decentralized home for Web3, Crypto, and AI builders. On-chain identity, community, and payments in one
            place.
          </p>
          <p className="font-mono text-xs text-muted-foreground">UPLINK_ESTABLISHED_</p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">{col.title}</h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Web3Sphere Labs. All rights reserved.</p>
          <p className="font-mono">SYS.CORE // ON-LINE</p>
        </div>
      </div>
    </footer>
  )
}

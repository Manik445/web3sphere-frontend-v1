import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PostJobForm } from '@/components/hire/post-job-form'

export const metadata: Metadata = {
  title: 'Post a project · Web3Sphere',
  description:
    'List your Web3, crypto, or AI project. Set a Builder Score threshold, required skills, and milestone budget — only trusted, relevant builders can bid.',
}

export default function PostJobPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
          <Link
            href="/hire"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>

          <div className="mt-6 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">List your work</span>
            <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Post a project
            </h1>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Describe the work and set who can bid. Trusted builders with relevant experience apply, then you assign
              tickets, meet, and pay through escrow.
            </p>
          </div>

          <div className="mt-8">
            <PostJobForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

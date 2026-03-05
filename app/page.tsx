import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PricingTable } from '@/components/billing/PricingTable'

const techStack = [
  'Next.js 15',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'Stripe',
  'shadcn/ui',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold">SaaS Kit</span>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">Open Source</Badge>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          The SaaS Starter Kit
          <br />
          <span className="text-primary">That Ships</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Authentication, 3-tier pricing, usage metering, webhook security,
          and a billing portal. Everything you need to launch your SaaS in a weekend.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">Start Free</Button>
          </Link>
          <a
            href="https://vercel.com/new/clone?repository-url=https://github.com/ChunkyTortoise/saas-starter-kit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline">Deploy to Vercel</Button>
          </a>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="outline">{tech}</Badge>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-4 pb-24" id="pricing">
        <h2 className="mb-12 text-center text-3xl font-bold">Simple, Transparent Pricing</h2>
        <PricingTable />
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Everything Included</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              { title: 'Supabase Auth', desc: 'Email/password, OAuth, magic links, session management with middleware protection.' },
              { title: '3-Tier Pricing', desc: 'Free, Pro, and Enterprise plans with Stripe Checkout and Customer Portal.' },
              { title: 'Usage Metering', desc: 'Track API events with idempotency keys to prevent double-billing.' },
              { title: 'Webhook Security', desc: 'Stripe signature verification for secure event processing.' },
              { title: 'Billing Portal', desc: 'Self-service subscription management via Stripe Customer Portal.' },
              { title: 'TypeScript First', desc: 'Full type safety with strict mode, no any types, validated at build time.' },
            ].map(({ title, desc }) => (
              <div key={title} className="space-y-2">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Built with Next.js 15, Supabase, and Stripe. Open source.</p>
      </footer>
    </div>
  )
}

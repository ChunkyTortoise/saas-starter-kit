import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PricingTable } from '@/components/billing/PricingTable'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'

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
      <HeroSection />

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-4 pb-24" id="pricing">
        <h2 className="mb-12 text-center text-3xl font-bold">Simple, Transparent Pricing</h2>
        <PricingTable />
      </section>

      {/* Features */}
      <FeaturesSection />

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Built with Next.js 15, Supabase, and Stripe. Open source.</p>
      </footer>
    </div>
  )
}

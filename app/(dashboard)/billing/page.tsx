import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PricingTable } from '@/components/billing/PricingTable'
import { PlanBadge } from '@/components/billing/PlanBadge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { TierKey } from '@/lib/billing'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users_extended')
    .select('plan, stripe_customer_id')
    .eq('id', user.id)
    .single()

  const tier = (profile?.plan ?? 'free') as TierKey
  const hasStripeCustomer = !!profile?.stripe_customer_id

  // Fetch subscription details
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                {subscription
                  ? `Renews ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  : 'Free tier - no billing'}
              </CardDescription>
            </div>
            <PlanBadge tier={tier} />
          </div>
        </CardHeader>
        {hasStripeCustomer && (
          <CardContent>
            <form action="/api/billing/portal" method="POST">
              <Button variant="outline">Manage Billing</Button>
            </form>
          </CardContent>
        )}
      </Card>

      <Separator />

      {/* Pricing Table */}
      <div>
        <h2 className="mb-6 text-xl font-semibold">Available Plans</h2>
        <PricingTable currentTier={tier} />
      </div>
    </div>
  )
}

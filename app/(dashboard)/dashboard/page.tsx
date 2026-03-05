import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlanBadge } from '@/components/billing/PlanBadge'
import { UsageMeter } from '@/components/billing/UsageMeter'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Button } from '@/components/ui/button'
import type { TierKey } from '@/lib/billing'
import { TIERS } from '@/lib/billing'
import { formatNumber } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's plan from users_extended (fallback to free)
  const { data: profile } = await supabase
    .from('users_extended')
    .select('plan')
    .eq('id', user.id)
    .single()

  const tier = (profile?.plan ?? 'free') as TierKey

  // Fetch usage count for current month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: monthlyUsage } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString())

  const used = monthlyUsage ?? 0
  const limit = TIERS[tier].monthlyEvents
  const remaining = Math.max(0, limit - used)

  // Today's usage
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { count: todayUsage } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfDay.toISOString())

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.email}
          </p>
        </div>
        <PlanBadge tier={tier} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Events Today"
          value={formatNumber(todayUsage ?? 0)}
          description="API events recorded today"
        />
        <StatsCard
          title="This Month"
          value={formatNumber(used)}
          description={`of ${formatNumber(limit)} included`}
        />
        <StatsCard
          title="Remaining"
          value={formatNumber(remaining)}
          description="events available this cycle"
        />
      </div>

      <UsageMeter used={used} tier={tier} />

      {tier === 'free' && (
        <div className="rounded-lg border bg-primary/5 p-6 text-center">
          <h3 className="text-lg font-semibold">Ready to scale?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrade to Pro for 10x more events and priority support.
          </p>
          <Link href="/billing" className="mt-4 inline-block">
            <Button>Upgrade Plan</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

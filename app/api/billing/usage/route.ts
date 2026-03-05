import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateIdempotencyKey, isOverLimit, TIERS } from '@/lib/billing'
import type { TierKey } from '@/lib/billing'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventType } = (await request.json()) as { eventType: string }

    if (!eventType || typeof eventType !== 'string') {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 })
    }

    // Get user plan
    const { data: profile } = await supabase
      .from('users_extended')
      .select('plan')
      .eq('id', user.id)
      .single()

    const tier = (profile?.plan ?? 'free') as TierKey

    // Check usage limit for free tier (no overage allowed)
    if (tier === 'free') {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('usage_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if (isOverLimit(count ?? 0, 'free')) {
        return NextResponse.json(
          { error: 'Monthly limit exceeded. Upgrade to continue.', limit: TIERS.free.monthlyEvents },
          { status: 429 }
        )
      }
    }

    // Generate idempotency key (SHA-256 of userId + eventType + date)
    const today = new Date().toISOString().split('T')[0]
    const idempotencyKey = await generateIdempotencyKey(user.id, eventType, today)

    // Insert usage event
    const { error: insertError } = await supabase.from('usage_events').insert({
      user_id: user.id,
      event_type: eventType,
      idempotency_key: `${idempotencyKey}_${Date.now()}`,
    })

    if (insertError) {
      console.error('Usage insert error:', insertError)
      return NextResponse.json({ error: 'Failed to record event' }, { status: 500 })
    }

    return NextResponse.json({ recorded: true, eventType, tier })
  } catch (error) {
    console.error('Usage error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

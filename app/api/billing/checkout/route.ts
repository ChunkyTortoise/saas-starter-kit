import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PRICE_IDS } from '@/lib/stripe'
import type { TierKey } from '@/lib/billing'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tier } = (await request.json()) as { tier: TierKey }

    if (!tier || !(tier in PRICE_IDS)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    const priceId = PRICE_IDS[tier]
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 400 })
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('users_extended')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from('users_extended')
        .upsert({ id: user.id, stripe_customer_id: customerId }, { onConflict: 'id' })
    }

    // Create Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get('origin')}/dashboard?checkout=success`,
      cancel_url: `${request.headers.get('origin')}/billing?checkout=cancelled`,
      metadata: { supabase_user_id: user.id, tier },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

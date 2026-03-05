import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getWebhookActions } from '@/lib/billing'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

// Use service role for webhook handler (no user context)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const actions = getWebhookActions(event.type)

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata.supabase_user_id

          if (userId) {
            const tier = subscription.metadata.tier ?? 'pro'
            await supabase
              .from('users_extended')
              .update({ plan: tier })
              .eq('id', userId)

            await supabase
              .from('subscriptions')
              .upsert(
                {
                  user_id: userId,
                  stripe_subscription_id: subscriptionId,
                  status: 'active',
                  current_period_end: new Date(
                    subscription.current_period_end * 1000
                  ).toISOString(),
                },
                { onConflict: 'stripe_subscription_id' }
              )
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string
        if (subscriptionId) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          const tier = subscription.metadata.tier ?? 'free'
          await supabase
            .from('users_extended')
            .update({ plan: tier })
            .eq('id', userId)

          await supabase
            .from('subscriptions')
            .upsert(
              {
                user_id: userId,
                stripe_subscription_id: subscription.id,
                status: subscription.status,
                current_period_end: new Date(
                  subscription.current_period_end * 1000
                ).toISOString(),
              },
              { onConflict: 'stripe_subscription_id' }
            )
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          // Downgrade to free
          await supabase
            .from('users_extended')
            .update({ plan: 'free' })
            .eq('id', userId)

          await supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_subscription_id', subscription.id)
        }
        break
      }
    }

    return NextResponse.json({
      received: true,
      type: event.type,
      actions,
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', type: event.type },
      { status: 500 }
    )
  }
}

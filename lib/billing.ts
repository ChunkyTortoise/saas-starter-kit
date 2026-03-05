export type TierKey = 'free' | 'pro' | 'enterprise'

export interface TierConfig {
  name: string
  price: number
  monthlyEvents: number
  overageRate: number
  features: string[]
  stripePriceEnv: string
}

export const TIERS: Record<TierKey, TierConfig> = {
  free: {
    name: 'Free',
    price: 0,
    monthlyEvents: 1000,
    overageRate: 0,
    features: [
      '1,000 events/month',
      'Basic dashboard',
      'Email support',
      'Community access',
    ],
    stripePriceEnv: 'STRIPE_PRICE_FREE',
  },
  pro: {
    name: 'Pro',
    price: 49,
    monthlyEvents: 10_000,
    overageRate: 0.005,
    features: [
      '10,000 events/month',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom integrations',
      'Usage overage billing',
    ],
    stripePriceEnv: 'STRIPE_PRICE_PRO',
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    monthlyEvents: 100_000,
    overageRate: 0.001,
    features: [
      '100,000 events/month',
      'Dedicated support',
      'SSO / SAML',
      'Custom contracts',
      'SLA guarantee',
      'Lowest overage rate',
    ],
    stripePriceEnv: 'STRIPE_PRICE_ENTERPRISE',
  },
} as const

/**
 * Generate a SHA-256 idempotency key to prevent duplicate billing events.
 * Mirrors billing_service.py _generate_idempotency_key pattern.
 */
export async function generateIdempotencyKey(
  userId: string,
  eventType: string,
  date: string
): Promise<string> {
  const data = `${userId}:${eventType}:${date}`
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex.slice(0, 32)
}

export function getTierByPriceId(priceId: string): TierKey | null {
  for (const [key, tier] of Object.entries(TIERS)) {
    const envValue = process.env[tier.stripePriceEnv]
    if (envValue === priceId) {
      return key as TierKey
    }
  }
  return null
}

export function getUsagePercentage(used: number, tier: TierKey): number {
  const limit = TIERS[tier].monthlyEvents
  if (limit === 0) return 0
  return Math.min(100, Math.round((used / limit) * 100))
}

export function isOverLimit(used: number, tier: TierKey): boolean {
  return used > TIERS[tier].monthlyEvents
}

export function calculateOverageCost(used: number, tier: TierKey): number {
  const limit = TIERS[tier].monthlyEvents
  const rate = TIERS[tier].overageRate
  if (used <= limit) return 0
  return (used - limit) * rate
}

/**
 * Map Stripe webhook event types to handler actions.
 * Mirrors billing_service.py process_webhook_event pattern.
 */
export function getWebhookActions(eventType: string): string[] {
  switch (eventType) {
    case 'invoice.payment_succeeded':
      return ['reset_usage_counter', 'update_subscription_period']
    case 'invoice.payment_failed':
      return ['mark_subscription_past_due', 'send_payment_failed_notification']
    case 'customer.subscription.updated':
      return ['sync_subscription_status', 'update_tier_configuration']
    case 'customer.subscription.deleted':
      return ['mark_subscription_canceled', 'deactivate_billing_features']
    default:
      return [`logged_unhandled_event_${eventType}`]
  }
}

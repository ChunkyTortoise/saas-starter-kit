import { describe, it, expect } from 'vitest'
import {
  generateIdempotencyKey,
  getWebhookActions,
  TIERS,
  getUsagePercentage,
  isOverLimit,
  calculateOverageCost,
  type TierKey,
} from '@/lib/billing'

describe('generateIdempotencyKey', () => {
  it('produces consistent output for same inputs', async () => {
    const key1 = await generateIdempotencyKey('user-123', 'api_call', '2026-03-05')
    const key2 = await generateIdempotencyKey('user-123', 'api_call', '2026-03-05')
    expect(key1).toBe(key2)
  })

  it('produces different output for different inputs', async () => {
    const key1 = await generateIdempotencyKey('user-123', 'api_call', '2026-03-05')
    const key2 = await generateIdempotencyKey('user-456', 'api_call', '2026-03-05')
    expect(key1).not.toBe(key2)
  })

  it('returns a 32-character hex string', async () => {
    const key = await generateIdempotencyKey('user-123', 'api_call', '2026-03-05')
    expect(key).toHaveLength(32)
    expect(key).toMatch(/^[0-9a-f]{32}$/)
  })

  it('different event types produce different keys', async () => {
    const key1 = await generateIdempotencyKey('user-123', 'api_call', '2026-03-05')
    const key2 = await generateIdempotencyKey('user-123', 'page_view', '2026-03-05')
    expect(key1).not.toBe(key2)
  })

  it('different dates produce different keys', async () => {
    const key1 = await generateIdempotencyKey('user-123', 'api_call', '2026-03-05')
    const key2 = await generateIdempotencyKey('user-123', 'api_call', '2026-03-06')
    expect(key1).not.toBe(key2)
  })
})

describe('getWebhookActions', () => {
  it('returns correct actions for invoice.payment_succeeded', () => {
    const actions = getWebhookActions('invoice.payment_succeeded')
    expect(actions).toEqual(['reset_usage_counter', 'update_subscription_period'])
  })

  it('returns correct actions for invoice.payment_failed', () => {
    const actions = getWebhookActions('invoice.payment_failed')
    expect(actions).toEqual(['mark_subscription_past_due', 'send_payment_failed_notification'])
  })

  it('returns correct actions for customer.subscription.updated', () => {
    const actions = getWebhookActions('customer.subscription.updated')
    expect(actions).toEqual(['sync_subscription_status', 'update_tier_configuration'])
  })

  it('returns correct actions for customer.subscription.deleted', () => {
    const actions = getWebhookActions('customer.subscription.deleted')
    expect(actions).toEqual(['mark_subscription_canceled', 'deactivate_billing_features'])
  })

  it('returns logged_unhandled for unknown events', () => {
    const actions = getWebhookActions('unknown.event')
    expect(actions).toEqual(['logged_unhandled_event_unknown.event'])
  })
})

describe('TIERS', () => {
  it('free tier has 1000 monthly events', () => {
    expect(TIERS.free.monthlyEvents).toBe(1000)
  })

  it('pro tier has 10000 monthly events', () => {
    expect(TIERS.pro.monthlyEvents).toBe(10000)
  })

  it('enterprise tier has 100000 monthly events', () => {
    expect(TIERS.enterprise.monthlyEvents).toBe(100000)
  })

  it('free tier has no overage rate', () => {
    expect(TIERS.free.overageRate).toBe(0)
  })

  it('pro overage rate is $0.005', () => {
    expect(TIERS.pro.overageRate).toBe(0.005)
  })

  it('enterprise overage rate is $0.001', () => {
    expect(TIERS.enterprise.overageRate).toBe(0.001)
  })

  it('all tiers have required fields', () => {
    const tierKeys: TierKey[] = ['free', 'pro', 'enterprise']
    for (const key of tierKeys) {
      const tier = TIERS[key]
      expect(tier.name).toBeDefined()
      expect(typeof tier.price).toBe('number')
      expect(typeof tier.monthlyEvents).toBe('number')
      expect(typeof tier.overageRate).toBe('number')
      expect(Array.isArray(tier.features)).toBe(true)
      expect(tier.features.length).toBeGreaterThan(0)
    }
  })
})

describe('getUsagePercentage', () => {
  it('returns 0 for no usage', () => {
    expect(getUsagePercentage(0, 'free')).toBe(0)
  })

  it('returns 50 for half usage', () => {
    expect(getUsagePercentage(500, 'free')).toBe(50)
  })

  it('caps at 100', () => {
    expect(getUsagePercentage(2000, 'free')).toBe(100)
  })

  it('calculates correctly for pro tier', () => {
    expect(getUsagePercentage(5000, 'pro')).toBe(50)
  })
})

describe('isOverLimit', () => {
  it('returns false when under limit', () => {
    expect(isOverLimit(500, 'free')).toBe(false)
  })

  it('returns false at exactly the limit', () => {
    expect(isOverLimit(1000, 'free')).toBe(false)
  })

  it('returns true when over limit', () => {
    expect(isOverLimit(1001, 'free')).toBe(true)
  })
})

describe('calculateOverageCost', () => {
  it('returns 0 when under limit', () => {
    expect(calculateOverageCost(500, 'pro')).toBe(0)
  })

  it('returns 0 at exactly the limit', () => {
    expect(calculateOverageCost(10000, 'pro')).toBe(0)
  })

  it('calculates overage for pro tier', () => {
    // 1000 over limit * $0.005 = $5.00
    expect(calculateOverageCost(11000, 'pro')).toBe(5)
  })

  it('calculates overage for enterprise tier', () => {
    // 5000 over limit * $0.001 = $5.00
    expect(calculateOverageCost(105000, 'enterprise')).toBe(5)
  })

  it('returns 0 for free tier (no overage)', () => {
    expect(calculateOverageCost(2000, 'free')).toBe(0)
  })
})

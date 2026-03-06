import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY

if (!key) {
  console.warn('STRIPE_SECRET_KEY not set - billing features disabled')
}

// Lazy singleton — avoids module-level initialization failure at build time
let _stripe: Stripe | null = null

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) {
      if (!key) throw new Error('STRIPE_SECRET_KEY not configured')
      _stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia', typescript: true })
    }
    const val = (_stripe as unknown as Record<string | symbol, unknown>)[prop]
    return typeof val === 'function' ? val.bind(_stripe) : val
  },
})

export const PRICE_IDS = {
  free: process.env.STRIPE_PRICE_FREE ?? 'price_free',
  pro: process.env.STRIPE_PRICE_PRO ?? '',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE ?? '',
} as const

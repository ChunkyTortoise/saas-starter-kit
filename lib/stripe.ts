import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - billing features disabled')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const PRICE_IDS = {
  free: process.env.STRIPE_PRICE_FREE ?? 'price_free',
  pro: process.env.STRIPE_PRICE_PRO ?? '',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE ?? '',
} as const

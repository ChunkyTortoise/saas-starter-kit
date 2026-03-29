'use client'

import { motion } from 'framer-motion'

const features = [
  { title: 'Supabase Auth', desc: 'Email/password, OAuth, magic links, session management with middleware protection.' },
  { title: '3-Tier Pricing', desc: 'Free, Pro, and Enterprise plans with Stripe Checkout and Customer Portal.' },
  { title: 'Usage Metering', desc: 'Track API events with idempotency keys to prevent double-billing.' },
  { title: 'Webhook Security', desc: 'Stripe signature verification for secure event processing.' },
  { title: 'Billing Portal', desc: 'Self-service subscription management via Stripe Customer Portal.' },
  { title: 'TypeScript First', desc: 'Full type safety with strict mode, no any types, validated at build time.' },
]

export function FeaturesSection() {
  return (
    <section className="border-t bg-muted/50 py-24">
      <div className="mx-auto max-w-4xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center text-3xl font-bold"
        >
          Everything Included
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 md:grid-cols-2"
        >
          {features.map(({ title, desc }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="space-y-2"
            >
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

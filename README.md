![Tests](https://img.shields.io/badge/tests-29%20passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![CI](https://github.com/ChunkyTortoise/saas-starter-kit/actions/workflows/ci.yml/badge.svg)

# SaaS Starter Kit

Next.js 15 SaaS starter with Supabase auth and Stripe billing.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ChunkyTortoise/saas-starter-kit)

## Features

- **Authentication** -- Supabase Auth with email/password, session management, and middleware protection
- **3-Tier Pricing** -- Free / Pro ($49/mo) / Enterprise ($199/mo) with Stripe Checkout
- **Usage Metering** -- Track API events with SHA-256 idempotency keys to prevent double-billing
- **Webhook Security** -- Stripe signature verification for `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Billing Portal** -- Self-service subscription management via Stripe Customer Portal
- **Dashboard** -- Usage meter, plan badge, stats cards, upgrade CTA
- **TypeScript** -- Strict mode, full type safety, no `any` types

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Supabase Auth + SSR |
| Billing | Stripe Checkout + Webhooks |
| Database | Supabase (PostgreSQL) |
| Testing | Vitest |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_FREE` | Stripe Price ID for free tier |
| `STRIPE_PRICE_PRO` | Stripe Price ID for pro tier |
| `STRIPE_PRICE_ENTERPRISE` | Stripe Price ID for enterprise tier |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `ANTHROPIC_API_KEY` | Optional: for AI features |

## Quick Start

```bash
# Install
npm install

# Set up env
cp .env.example .env.local

# Run schema in Supabase SQL editor
# See supabase/schema.sql

# Dev server
npm run dev

# Tests
npm test
```

## Project Structure

```
app/
  (auth)/login, signup      Auth pages
  (dashboard)/              Protected dashboard, billing, settings
  api/billing/              Checkout, portal, usage, webhook routes
  api/auth/callback         Supabase auth callback
components/
  ui/                       shadcn/ui (button, card, badge, progress)
  auth/                     Login/Signup forms
  billing/                  PricingTable, UsageMeter, PlanBadge
  dashboard/                Sidebar, StatsCard
lib/
  supabase/                 Browser + server clients
  stripe.ts                 Stripe client + price config
  billing.ts                Tier config, idempotency, usage math
  utils.ts                  cn(), formatters
supabase/
  schema.sql                Tables, RLS policies, triggers
tests/
  billing.test.ts           Billing logic + webhook tests
```

## Screenshots

| Landing | Dashboard | Billing |
|---------|-----------|---------|
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Billing](docs/screenshots/billing.png) |

> Live at [https://saas-starter-kit-caymanroden-6685.vercel.app](https://saas-starter-kit-caymanroden-6685.vercel.app)

## License

MIT

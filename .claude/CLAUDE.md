# SaaS Starter Kit

## Stack
Next.js 15 | TypeScript | Supabase (auth + DB) | Stripe (billing) | Anthropic | Tailwind CSS | Vitest

## Architecture
Full-stack SaaS template with auth, billing, and AI features. Lazy Stripe init (Proxy singleton) + force-dynamic on billing routes for Vercel compatibility. Free / Pro ($49) / Business ($149) plans.
- `app/` — Next.js App Router (auth, dashboard, billing, API routes)
- `lib/supabase/` — Supabase client (server + browser)
- `lib/stripe/` — Stripe Proxy singleton (avoids build-time init)
- `components/` — UI components

## Deploy
Vercel — https://saas-starter-kit-caymanroden-6685.vercel.app

## Test
```npm test  # 61 tests (Vitest)```

## Key Env
SUPABASE_URL, SUPABASE_JWT_SECRET, STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY

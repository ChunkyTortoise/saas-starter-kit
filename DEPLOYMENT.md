# Deployment Guide

## Prerequisites

- Node.js 18+
- Supabase project (free tier works)
- Stripe account with test keys

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Enable Email auth in Authentication > Providers
4. Copy the project URL and anon key

## 2. Stripe Setup

1. Create products/prices for Free, Pro, Enterprise in Stripe Dashboard
2. Set up a webhook endpoint pointing to `https://your-domain.com/api/billing/webhook`
3. Subscribe to events:
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret

## 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in all values from steps 1-2.

## 4. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ChunkyTortoise/saas-starter-kit)

1. Click the button above (or `vercel --prod` from CLI)
2. Add all environment variables in Vercel dashboard
3. Update Stripe webhook URL to your production domain

## 5. Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For Stripe webhook testing locally:
```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

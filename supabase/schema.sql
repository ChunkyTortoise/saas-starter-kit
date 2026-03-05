-- SaaS Starter Kit Database Schema
-- Run this in the Supabase SQL editor to set up the required tables.

-- User extended profile (linked to Supabase auth.users)
create table if not exists public.users_extended (
  id uuid references auth.users primary key,
  stripe_customer_id text unique,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  created_at timestamptz default now()
);

-- Subscriptions (synced from Stripe webhooks)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users_extended not null,
  stripe_subscription_id text unique not null,
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

-- Usage events (usage-based billing with idempotency)
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users_extended not null,
  event_type text not null,
  idempotency_key text unique,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_usage_events_user_created
  on public.usage_events (user_id, created_at desc);

create index if not exists idx_subscriptions_user_status
  on public.subscriptions (user_id, status);

create index if not exists idx_usage_events_idempotency
  on public.usage_events (idempotency_key);

-- Row Level Security (RLS)
alter table public.users_extended enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_events enable row level security;

-- Users can read/update their own extended profile
create policy "Users can view own profile"
  on public.users_extended for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users_extended for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users_extended for insert
  with check (auth.uid() = id);

-- Users can view their own subscriptions
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Users can view and insert their own usage events
create policy "Users can view own usage"
  on public.usage_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.usage_events for insert
  with check (auth.uid() = user_id);

-- Service role bypass for webhook handler (uses SUPABASE_SERVICE_ROLE_KEY)
-- Service role automatically bypasses RLS, so no extra policy needed.

-- Auto-create users_extended row on signup (optional trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users_extended (id, plan)
  values (new.id, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

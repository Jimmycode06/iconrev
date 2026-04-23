-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Cards table
create table if not exists public.cards (
  id text primary key,
  google_place_id text,
  review_url text,
  business_name text,
  business_address text,
  owner_email text,
  owner_id uuid references auth.users(id),
  activated_at timestamptz,
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.cards enable row level security;

-- 3. RLS policies

-- Anyone can read the review_url of activated cards (needed for redirect)
drop policy if exists "Public can read activated card review_url" on public.cards;
create policy "Public can read activated card review_url"
  on public.cards for select
  using (review_url is not null);

-- Authenticated users can activate unactivated cards
drop policy if exists "Authenticated users can activate cards" on public.cards;
create policy "Authenticated users can activate cards"
  on public.cards for update
  using (
    auth.role() = 'authenticated'
    and review_url is null
  )
  with check (
    auth.uid() = owner_id
  );

-- Owners can read their own cards
drop policy if exists "Owners can read own cards" on public.cards;
create policy "Owners can read own cards"
  on public.cards for select
  using (auth.uid() = owner_id);

-- 4. Index for fast lookup by card ID (primary key already handles this)
-- Additional index on owner_id for dashboard queries
create index if not exists idx_cards_owner_id on public.cards(owner_id);

-- 5. Orders table (synced from Stripe webhooks)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  customer_email text,
  amount_total integer not null default 0,
  currency text not null default 'EUR',
  payment_status text not null default 'unpaid',
  order_status text not null default 'pending',
  business_name text,
  business_place_id text,
  business_address text,
  shipping_name text,
  shipping_line1 text,
  shipping_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text,
  raw_checkout_session jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Order items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  stripe_line_item_id text,
  stripe_price_id text,
  stripe_product_id text,
  product_name text not null,
  quantity integer not null default 1,
  unit_amount integer not null default 0,
  amount_subtotal integer not null default 0,
  amount_total integer not null default 0,
  currency text not null default 'EUR',
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- 7. Keep updated_at fresh on updates
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_set_updated_at on public.orders;
create trigger trg_orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

-- 8. RLS for orders tables (disabled public access)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

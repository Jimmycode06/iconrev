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
create policy "Public can read activated card review_url"
  on public.cards for select
  using (review_url is not null);

-- Authenticated users can activate unactivated cards
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
create policy "Owners can read own cards"
  on public.cards for select
  using (auth.uid() = owner_id);

-- 4. Index for fast lookup by card ID (primary key already handles this)
-- Additional index on owner_id for dashboard queries
create index if not exists idx_cards_owner_id on public.cards(owner_id);

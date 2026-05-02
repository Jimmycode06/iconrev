-- Migration: add fulfillment tracking columns to orders
--
-- For now, only La Poste is supported as a carrier. The tracking_url is
-- generated server-side from shipping_carrier + tracking_number, but we
-- also store it for convenience.
--
-- Run this in the Supabase SQL editor or via the CLI.

alter table public.orders
  add column if not exists tracking_number text,
  add column if not exists shipping_carrier text,
  add column if not exists tracking_url text,
  add column if not exists fulfilled_at timestamptz;

-- Helpful index when filtering fulfilled orders by date
create index if not exists idx_orders_fulfilled_at
  on public.orders (fulfilled_at desc)
  where fulfilled_at is not null;

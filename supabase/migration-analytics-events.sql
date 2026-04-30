-- Analytics events for the Iconrev admin dashboard.
-- Run this in Supabase SQL Editor after deploying the app code.

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  path text,
  referrer text,
  anonymous_id text,
  session_id text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

-- No public read/write policies: events are written and read through server routes
-- using SUPABASE_SERVICE_ROLE_KEY.

create index if not exists idx_analytics_events_created_at
  on public.analytics_events (created_at desc);

create index if not exists idx_analytics_events_event_type_created_at
  on public.analytics_events (event_type, created_at desc);

create index if not exists idx_analytics_events_anonymous_id
  on public.analytics_events (anonymous_id);

create index if not exists idx_analytics_events_session_id
  on public.analytics_events (session_id);

-- Run once in Supabase SQL Editor: human order numbers (Stripe has cs_ / pi_ only)
-- 1) Sequence + column
create sequence if not exists public.orders_order_number_seq start with 1001;

alter table public.orders
  add column if not exists order_number integer;

-- 2) Backfill existing rows (oldest = 1001, …)
with ranked as (
  select
    id,
    row_number() over (order by created_at asc) as rn
  from public.orders
  where order_number is null
)
update public.orders o
set order_number = 1000 + r.rn
from ranked r
where o.id = r.id;

-- 3) Next inserts get the next value (upsert « update » ne touche pas order_number côté app)
create or replace function public.orders_assign_order_number()
returns trigger
language plpgsql
as $fn$
begin
  if new.order_number is null then
    new.order_number := nextval('public.orders_order_number_seq');
  end if;
  return new;
end;
$fn$;

drop trigger if exists trg_orders_assign_order_number on public.orders;
create trigger trg_orders_assign_order_number
  before insert on public.orders
  for each row
  execute function public.orders_assign_order_number();

-- 4) Keep sequence after max (including backfill)
select setval(
  'public.orders_order_number_seq',
  coalesce((select max(order_number) from public.orders), 1000)
);

create unique index if not exists idx_orders_order_number
  on public.orders (order_number)
  where order_number is not null;

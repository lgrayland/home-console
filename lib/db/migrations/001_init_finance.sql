-- migrate:up
create extension if not exists pgcrypto;

create table if not exists account (
  id text primary key,
  -- canonical identifier, e.g.:
  -- 'es_current', 'es_joint', 'es_credit_card'
  name text not null,
  type text not null,  -- 'current' | 'savings' | 'credit'
  currency char(3) not null default 'EUR',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint account_type_chk check (type in ('current', 'savings', 'credit'))
);

create table if not exists cash_flow (
  id uuid primary key default gen_random_uuid(),

  account_id text not null
    references account(id)
    on delete restrict,

  name text not null,
  direction text not null, -- 'in' | 'out'
  amount_pence integer not null, -- always positive

  frequency text not null, -- 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  category text not null,
  payment_method text null, -- 'Direct Debit' | 'Standing Order' | 'Card' | 'Transfer'

  -- Optional scheduling (future widgets)
  due_day smallint null, -- 1..28 recommended

  notes text null,
  is_active boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint cash_flow_direction_chk
    check (direction in ('in', 'out')),

  constraint cash_flow_frequency_chk
    check (frequency in ('weekly','monthly','quarterly','yearly')),

  constraint cash_flow_amount_chk
    check (amount_pence > 0),

  constraint cash_flow_due_day_chk
    check (due_day is null or (due_day between 1 and 28))
);

create index if not exists cash_flow_account_active_idx
  on cash_flow (account_id, is_active);

create index if not exists cash_flow_category_idx
  on cash_flow (category);

create index if not exists cash_flow_payment_method_idx
  on cash_flow (payment_method);

-- Seed Spain accounts (EUR)
insert into account (id, name, type) values
  ('es_current', 'Personal (Spain)', 'current'),
  ('es_joint', 'Joint (Spain)', 'current'),
  ('es_credit_card', 'Credit Card (Spain)', 'credit')
on conflict (id) do nothing;


-- migrate:down
-- Drop dependent objects first
drop table if exists cash_flow;
drop table if exists account;

-- Optional: keep pgcrypto (often shared), so we don't drop the extension
-- drop extension if exists pgcrypto;

-- migrate:up
create extension if not exists pgcrypto;

create table todos (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  notes text null,

  status text not null default 'open',
  due_date date null,

  source_thought_id uuid null unique references thoughts(id) on delete set null,

  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

create index todos_status_created_at_idx
  on todos (status, created_at desc);

create index todos_due_date_idx
  on todos (due_date);

-- migrate:down
drop table if exists todos;

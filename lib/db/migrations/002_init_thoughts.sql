-- migrate:up
create extension if not exists pgcrypto;

create table thoughts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  status text not null default 'inbox',
  created_at timestamptz not null default now()
);

create index thoughts_status_created_at_idx
  on thoughts (status, created_at desc);

-- migrate:down
drop table if exists thoughts;
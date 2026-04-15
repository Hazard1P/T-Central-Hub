create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  reference text unique not null,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.player_reports (
  id bigint generated always as identity primary key,
  reference text unique not null,
  reported_player text not null,
  server text,
  reason text not null,
  evidence text not null,
  reporter_steamid text,
  reporter_name text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.donation_receipts (
  id bigint generated always as identity primary key,
  reference text unique not null,
  provider text not null,
  order_id text not null,
  capture_id text,
  steamid text,
  personaname text,
  amount text,
  currency text,
  status text,
  anchor_slug text,
  solar_system_key text,
  payer text,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

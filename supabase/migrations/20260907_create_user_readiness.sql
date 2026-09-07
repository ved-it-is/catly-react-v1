create table if not exists public.user_readiness (
  user_id uuid primary key references auth.users(id) on delete cascade,
  target_percentile numeric(4, 1) not null default 95.0
    check (target_percentile >= 50 and target_percentile <= 100),
  readiness_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_readiness enable row level security;

revoke all on table public.user_readiness from anon;
grant select, insert, update, delete on table public.user_readiness to authenticated;

drop policy if exists "Users can read their own readiness" on public.user_readiness;
create policy "Users can read their own readiness"
  on public.user_readiness for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own readiness" on public.user_readiness;
create policy "Users can insert their own readiness"
  on public.user_readiness for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own readiness" on public.user_readiness;
create policy "Users can update their own readiness"
  on public.user_readiness for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own readiness" on public.user_readiness;
create policy "Users can delete their own readiness"
  on public.user_readiness for delete
  using (auth.uid() = user_id);

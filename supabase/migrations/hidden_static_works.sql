create table if not exists public.hidden_static_works (
  work_id text primary key,
  hidden_at timestamptz not null default now()
);

alter table public.hidden_static_works enable row level security;

drop policy if exists "Public read hidden static works" on public.hidden_static_works;
create policy "Public read hidden static works"
  on public.hidden_static_works for select
  using (true);

drop policy if exists "Allow insert hidden static works" on public.hidden_static_works;
create policy "Allow insert hidden static works"
  on public.hidden_static_works for insert
  with check (true);

drop policy if exists "Allow delete hidden static works" on public.hidden_static_works;
create policy "Allow delete hidden static works"
  on public.hidden_static_works for delete
  using (true);

notify pgrst, 'reload schema';

create table if not exists public.showreel_settings (
  id text primary key default 'default',
  desktop_url text,
  mobile_url text,
  updated_at timestamptz not null default now()
);

insert into public.showreel_settings (id)
values ('default')
on conflict (id) do nothing;

alter table public.showreel_settings enable row level security;

drop policy if exists "Public read showreel settings" on public.showreel_settings;
create policy "Public read showreel settings"
  on public.showreel_settings for select
  using (true);

drop policy if exists "Allow update showreel settings" on public.showreel_settings;
create policy "Allow update showreel settings"
  on public.showreel_settings for update
  using (true)
  with check (true);

drop policy if exists "Allow insert showreel settings" on public.showreel_settings;
create policy "Allow insert showreel settings"
  on public.showreel_settings for insert
  with check (true);

notify pgrst, 'reload schema';

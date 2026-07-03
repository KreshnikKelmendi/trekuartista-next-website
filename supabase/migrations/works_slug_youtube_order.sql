alter table public.works
  add column if not exists slug text,
  add column if not exists youtube_link text,
  add column if not exists youtube_videos jsonb not null default '[]'::jsonb,
  add column if not exists youtube_only boolean not null default false;

create unique index if not exists works_slug_idx on public.works (slug)
  where slug is not null;

update public.works
set slug = trim(both '-' from regexp_replace(lower(work_name), '[^a-z0-9]+', '-', 'g'))
where slug is null;

create table if not exists public.work_display_order (
  work_id text primary key,
  sort_order integer not null
);

alter table public.work_display_order enable row level security;

drop policy if exists "Public read work display order" on public.work_display_order;
create policy "Public read work display order"
  on public.work_display_order for select
  using (true);

drop policy if exists "Allow upsert work display order" on public.work_display_order;
create policy "Allow upsert work display order"
  on public.work_display_order for insert
  with check (true);

drop policy if exists "Allow update work display order" on public.work_display_order;
create policy "Allow update work display order"
  on public.work_display_order for update
  using (true)
  with check (true);

drop policy if exists "Allow delete work display order" on public.work_display_order;
create policy "Allow delete work display order"
  on public.work_display_order for delete
  using (true);

notify pgrst, 'reload schema';

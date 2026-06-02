create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  work_name text not null,
  special_category text not null,
  work_image text not null,
  work_thumbnail text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists works_created_at_idx on public.works (created_at desc);

alter table public.works
  add column if not exists description text not null default '';

alter table public.works enable row level security;

drop policy if exists "Public read works" on public.works;
create policy "Public read works"
  on public.works for select
  using (true);

drop policy if exists "Allow insert works" on public.works;
create policy "Allow insert works"
  on public.works for insert
  with check (true);

drop policy if exists "Allow delete works" on public.works;
create policy "Allow delete works"
  on public.works for delete
  using (true);

drop policy if exists "Allow update works" on public.works;
create policy "Allow update works"
  on public.works for update
  using (true)
  with check (true);

create table if not exists public.work_media (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  url text not null,
  thumbnail text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists work_media_work_id_idx on public.work_media (work_id, sort_order);

alter table public.work_media enable row level security;

drop policy if exists "Public read work media" on public.work_media;
create policy "Public read work media"
  on public.work_media for select
  using (true);

drop policy if exists "Allow insert work media" on public.work_media;
create policy "Allow insert work media"
  on public.work_media for insert
  with check (true);

drop policy if exists "Allow delete work media" on public.work_media;
create policy "Allow delete work media"
  on public.work_media for delete
  using (true);

drop policy if exists "Allow update work media" on public.work_media;
create policy "Allow update work media"
  on public.work_media for update
  using (true)
  with check (true);

insert into public.work_media (work_id, url, thumbnail, media_type, sort_order)
select
  w.id,
  w.work_image,
  w.work_thumbnail,
  case
    when w.work_image ~* '\.(mp4|webm|mov)(\?|$)' or w.work_image like '%/videos/%' then 'video'
    else 'image'
  end,
  0
from public.works w
where w.work_image is not null
  and w.work_image <> ''
  and not exists (
    select 1 from public.work_media wm where wm.work_id = w.id
  );

create table if not exists public.work_descriptions (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  content text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists work_descriptions_work_id_idx on public.work_descriptions (work_id, sort_order);

alter table public.work_descriptions enable row level security;

drop policy if exists "Public read work descriptions" on public.work_descriptions;
create policy "Public read work descriptions"
  on public.work_descriptions for select
  using (true);

drop policy if exists "Allow insert work descriptions" on public.work_descriptions;
create policy "Allow insert work descriptions"
  on public.work_descriptions for insert
  with check (true);

drop policy if exists "Allow delete work descriptions" on public.work_descriptions;
create policy "Allow delete work descriptions"
  on public.work_descriptions for delete
  using (true);

drop policy if exists "Allow update work descriptions" on public.work_descriptions;
create policy "Allow update work descriptions"
  on public.work_descriptions for update
  using (true)
  with check (true);

insert into public.work_descriptions (work_id, content, sort_order)
select w.id, w.description, 0
from public.works w
where w.description is not null
  and trim(w.description) <> ''
  and not exists (
    select 1 from public.work_descriptions wd where wd.work_id = w.id
  );

insert into storage.buckets (id, name, public)
values ('works-media', 'works-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read works media" on storage.objects;
create policy "Public read works media"
  on storage.objects for select
  using (bucket_id = 'works-media');

drop policy if exists "Allow upload works media" on storage.objects;
create policy "Allow upload works media"
  on storage.objects for insert
  with check (bucket_id = 'works-media');

drop policy if exists "Allow delete works media" on storage.objects;
create policy "Allow delete works media"
  on storage.objects for delete
  using (bucket_id = 'works-media');

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  image text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists team_members_created_at_idx on public.team_members (created_at asc);

alter table public.team_members enable row level security;

drop policy if exists "Public read team members" on public.team_members;
create policy "Public read team members"
  on public.team_members for select
  using (true);

drop policy if exists "Allow insert team members" on public.team_members;
create policy "Allow insert team members"
  on public.team_members for insert
  with check (true);

drop policy if exists "Allow delete team members" on public.team_members;
create policy "Allow delete team members"
  on public.team_members for delete
  using (true);

insert into storage.buckets (id, name, public)
values ('team-media', 'team-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read team media" on storage.objects;
create policy "Public read team media"
  on storage.objects for select
  using (bucket_id = 'team-media');

drop policy if exists "Allow upload team media" on storage.objects;
create policy "Allow upload team media"
  on storage.objects for insert
  with check (bucket_id = 'team-media');

drop policy if exists "Allow delete team media" on storage.objects;
create policy "Allow delete team media"
  on storage.objects for delete
  using (bucket_id = 'team-media');

notify pgrst, 'reload schema';

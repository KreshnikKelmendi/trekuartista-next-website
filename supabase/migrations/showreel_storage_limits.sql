-- Raise works-media bucket limit (must also increase global limit in Supabase Dashboard → Storage → Settings).
-- Free plan: global max is 50 MB. Pro+: set global limit first, then run this.

update storage.buckets
set file_size_limit = 524288000
where id = 'works-media';

notify pgrst, 'reload schema';

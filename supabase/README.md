# Supabase setup

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/uzweyvxkwomywolhhdfp/sql/new).
2. Paste and run `migrations/works.sql`.
3. In **Project Settings → API**, copy the **service_role** key into `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Restart `npm run dev`.

If you still see **schema cache** errors after running the SQL, run this once in the SQL Editor:

```sql
NOTIFY pgrst, 'reload schema';
```

Creates `works`, `team_members` tables and `works-media`, `team-media` storage buckets.

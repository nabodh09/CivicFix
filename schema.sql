-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).
--
-- Already ran an earlier version of this schema? Just run this instead to add
-- the new columns (safe to run even if they already exist):
--   alter table complaints add column if not exists priority text not null default 'low' check (priority in ('low','medium','high'));
--   alter table complaints add column if not exists latitude double precision;
--   alter table complaints add column if not exists longitude double precision;

-- ---------- Tables ----------

create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  role text not null check (role in ('citizen','authority')),
  created_at timestamptz default now()
);

create table if not exists complaints (
  id bigserial primary key,
  citizen_id uuid references profiles(id) not null,
  title text not null,
  category text not null,
  description text not null,
  location_text text not null,
  photo_url text not null,
  status text not null default 'open' check (status in ('open','in_progress','closed')),
  priority text not null default 'low' check (priority in ('low','medium','high')),
  latitude double precision,
  longitude double precision,
  resolution_photo_url text,
  resolution_note text,
  closed_by uuid references profiles(id),
  created_at timestamptz default now(),
  closed_at timestamptz
);

-- ---------- Row Level Security ----------

alter table profiles enable row level security;
alter table complaints enable row level security;

-- Profiles: anyone signed in can read profiles (needed to show "filed by" names).
-- Users can only create their own profile row.
create policy "profiles are readable" on profiles
  for select using (true);

create policy "users insert their own profile" on profiles
  for insert with check (auth.uid() = id);

-- Complaints: readable by everyone, including logged-out visitors (home page bulletin).
create policy "complaints are readable" on complaints
  for select using (true);

-- Citizens can only file complaints under their own id.
create policy "citizens insert their own complaints" on complaints
  for insert with check (auth.uid() = citizen_id);

-- Any authenticated user can update a complaint's status/resolution fields.
-- For a production app, tighten this to check profiles.role = 'authority'.
create policy "authenticated users can update complaints" on complaints
  for update using (auth.role() = 'authenticated');

-- ---------- Storage ----------
-- Create these two buckets from the Supabase dashboard (Storage -> New bucket),
-- both marked Public:
--   complaint-photos
--   resolution-photos
--
-- Then add a public-read + authenticated-write policy on each bucket, e.g. for
-- complaint-photos (repeat for resolution-photos):
--
-- create policy "public read complaint photos" on storage.objects
--   for select using (bucket_id = 'complaint-photos');
--
-- create policy "authenticated upload complaint photos" on storage.objects
--   for insert with check (bucket_id = 'complaint-photos' and auth.role() = 'authenticated');

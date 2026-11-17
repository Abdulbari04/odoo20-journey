-- شغّل ده في Supabase > SQL Editor مرة واحدة
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  job text,
  kv jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own row read"   on public.profiles for select using (auth.uid() = id);
create policy "own row insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own row update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

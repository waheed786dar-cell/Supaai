-- Run this in your Supabase SQL editor to set up the database

-- ============================================================
-- PROFILES TABLE
-- Extends the built-in auth.users table
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  plan text not null default 'free', -- 'free' | 'pro'
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- MESSAGES TABLE
-- Stores all chat messages
-- ============================================================
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  conversation_id uuid not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Users can only see their own messages
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.messages for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- DAILY USAGE TABLE
-- Tracks message count per user per day (for free tier limits)
-- ============================================================
create table public.daily_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  message_count integer not null default 0,
  unique(user_id, date)
);

alter table public.daily_usage enable row level security;

create policy "Users can view own usage"
  on public.daily_usage for select
  using (auth.uid() = user_id);

create policy "Users can upsert own usage"
  on public.daily_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.daily_usage for update
  using (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- FUNCTION: Increment daily usage (atomic upsert)
-- ============================================================
create or replace function public.increment_daily_usage(p_user_id uuid)
returns integer as $$
declare
  new_count integer;
begin
  insert into public.daily_usage (user_id, date, message_count)
  values (p_user_id, current_date, 1)
  on conflict (user_id, date)
  do update set message_count = daily_usage.message_count + 1
  returning message_count into new_count;
  
  return new_count;
end;
$$ language plpgsql security definer;

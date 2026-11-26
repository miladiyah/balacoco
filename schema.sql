-- Skema awal opsional untuk tahap berikutnya ketika BALACOCO memakai akun dan sinkronisasi lintas perangkat.
-- Jalankan di Supabase SQL Editor setelah membuat project Supabase.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.flashcard_reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  flashcard_id text not null,
  known boolean not null default false,
  reviewed_at timestamptz not null default now(),
  unique(user_id, flashcard_id)
);

create table if not exists public.practice_submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null,
  score integer not null check (score between 0 and 100),
  answer jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.flashcard_reviews enable row level security;
alter table public.practice_submissions enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read own lesson progress" on public.lesson_progress for select using (auth.uid() = user_id);
create policy "Users can insert own lesson progress" on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users can read own quiz attempts" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own quiz attempts" on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "Users can read own flashcard reviews" on public.flashcard_reviews for select using (auth.uid() = user_id);
create policy "Users can manage own flashcard reviews" on public.flashcard_reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can read own practice submissions" on public.practice_submissions for select using (auth.uid() = user_id);
create policy "Users can insert own practice submissions" on public.practice_submissions for insert with check (auth.uid() = user_id);

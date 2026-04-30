-- ============================================================
-- AGENT EXCELLENCE — Demo Phase Migration
-- Run in Supabase SQL Editor → Run
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT DO NOTHING)
-- ============================================================

-- 1. EVAL LOCKS — tracks which agencies have locked evaluations
create table if not exists eval_locks (
  id uuid primary key default gen_random_uuid(),
  agency_name text not null unique,
  is_locked boolean default false,
  locked_by text,
  locked_at timestamptz,
  updated_at timestamptz default now()
);

alter table eval_locks enable row level security;
create policy "eval_locks_read"   on eval_locks for select to authenticated using (true);
create policy "eval_locks_write"  on eval_locks for all    to authenticated
  using  ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'))
  with check ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'));

-- 2. EVAL SNAPSHOTS — monthly score snapshot per agency (JSON blob)
create table if not exists eval_snapshots (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  year integer not null,
  agency_name text not null,
  scores jsonb not null default '{}',
  created_at timestamptz default now(),
  unique(month, year, agency_name)
);

alter table eval_snapshots enable row level security;
create policy "snapshots_read"  on eval_snapshots for select to authenticated using (true);
create policy "snapshots_write" on eval_snapshots for all    to authenticated
  using  ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'))
  with check ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'));

-- 3. EVAL HISTORY — audit log of every lock event
create table if not exists eval_history (
  id uuid primary key default gen_random_uuid(),
  agency_name text not null,
  month text not null,
  year integer not null,
  locked_by text not null,
  seg_scores jsonb not null default '{}',
  overall integer default 0,
  prev_seg_scores jsonb,
  prev_overall integer,
  created_at timestamptz default now()
);

alter table eval_history enable row level security;
create policy "history_read"  on eval_history for select to authenticated using (true);
create policy "history_write" on eval_history for insert to authenticated with check (true);

-- 4. ANNUAL ACTION WEEKS — already in schema, verify exists
-- (already created in original migration as annual_action_weeks)

-- 5. ANNUAL ACTIONS — top-level annual action records per agency
-- If not present, add agency_name column concept via a separate table
create table if not exists annual_actions_state (
  id uuid primary key default gen_random_uuid(),
  action_number integer not null, -- 1-12
  agency_name text not null,
  week_data jsonb not null default '[]', -- array of {week, status, note}
  updated_at timestamptz default now(),
  unique(action_number, agency_name)
);

alter table annual_actions_state enable row level security;
create policy "annual_state_read"   on annual_actions_state for select to authenticated using (true);
create policy "annual_state_write"  on annual_actions_state for all    to authenticated using (true) with check (true);

-- 6. Ensure knowledge_cards has author_name column (may be missing)
alter table knowledge_cards add column if not exists author_name text;

-- 7. USER PREFERENCES — store per-user UI state
create table if not exists user_preferences (
  id uuid primary key references auth.users(id) on delete cascade,
  sel_agency text,
  open_groups jsonb default '{}',
  updated_at timestamptz default now()
);

alter table user_preferences enable row level security;
create policy "prefs_own" on user_preferences for all to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- ============================================================
-- HELPER: upsert score function (faster than per-row updates)
-- ============================================================
create or replace function upsert_score(
  p_agency_name text,
  p_segment text,
  p_criterion_key text,
  p_score integer,
  p_evaluated_by uuid default null
) returns void language plpgsql security definer as $$
declare
  v_agency_id uuid;
begin
  select id into v_agency_id from agencies where name = p_agency_name;
  if v_agency_id is null then
    insert into agencies (name) values (p_agency_name)
    returning id into v_agency_id;
  end if;

  insert into scores (agency_id, segment, criterion_key, score, evaluated_by, updated_at)
  values (v_agency_id, p_segment, p_criterion_key, p_score, p_evaluated_by, now())
  on conflict (agency_id, segment, criterion_key)
  do update set score = p_score, evaluated_by = p_evaluated_by, updated_at = now();
end;
$$;

-- ============================================================
-- HELPER: load all scores as flat JSON (one call instead of N)
-- ============================================================
create or replace function get_all_scores()
returns table(agency_name text, segment text, criterion_key text, score integer)
language sql security definer as $$
  select a.name, s.segment, s.criterion_key, s.score
  from scores s
  join agencies a on a.id = s.agency_id;
$$;

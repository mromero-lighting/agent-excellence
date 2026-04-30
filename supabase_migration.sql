-- ============================================================
-- AGENT EXCELLENCE — Full Schema Migration
-- Run this in Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. AGENCIES
create table if not exists agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  region text,
  created_at timestamptz default now()
);

-- Seed agencies
insert into agencies (name, region) values
  ('CAN 1','Canada'),('CAN 2','Canada'),
  ('West 1','Pacific'),('West 2','Pacific'),
  ('NE 1','Northeast'),('NE 2','Northeast'),
  ('Gulf 1','Gulf'),('Gulf 2','Gulf'),
  ('SE 1','Southeast'),('SE 2','Southeast'),
  ('Central 1','Central'),('Central 2','Central')
on conflict (name) do nothing;

-- 2. PROFILES (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text check (role in ('admin','vp','rsm','owner','staff')) default 'staff',
  agency_id uuid references agencies(id),
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role','staff'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 3. SCORES
create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  segment text not null,
  criterion_key text not null,
  score integer check (score between 0 and 4) default 0,
  evaluated_by uuid references profiles(id),
  notes text,
  updated_at timestamptz default now(),
  unique(agency_id, segment, criterion_key)
);

-- 4. ACTIONS (3-window tracker)
create table if not exists actions (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  time_window text check (time_window in ('last30','current','next30')) not null,
  title text not null,
  segment text,
  owner text,
  status text check (status in ('complete','in_progress','pending','overdue')) default 'pending',
  priority text check (priority in ('high','medium','low')) default 'medium',
  metric text,
  actual integer default 0,
  target integer default 1,
  due_date date,
  description text,
  tags text[],
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. ACTION COMMENTS
create table if not exists action_comments (
  id uuid primary key default gen_random_uuid(),
  action_id uuid references actions(id) on delete cascade,
  author_id uuid references profiles(id),
  author_name text,
  body text not null,
  created_at timestamptz default now()
);

-- 6. ANNUAL ACTIONS
create table if not exists annual_actions (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  quarter integer check (quarter between 1 and 4),
  segment text,
  color text,
  title text not null,
  description text,
  kpi text,
  metric text,
  owner text,
  created_at timestamptz default now()
);

-- 7. ANNUAL ACTION WEEKS
create table if not exists annual_action_weeks (
  id uuid primary key default gen_random_uuid(),
  annual_action_id uuid references annual_actions(id) on delete cascade,
  week_number integer check (week_number between 1 and 13),
  status text check (status in ('pending','in_progress','complete')) default 'pending',
  note text default '',
  updated_at timestamptz default now(),
  unique(annual_action_id, week_number)
);

-- 8. KNOWLEDGE CARDS
create table if not exists knowledge_cards (
  id uuid primary key default gen_random_uuid(),
  seg text not null,
  category text,
  title text not null,
  type text default 'Guide',
  content text,
  author_name text,
  url text,
  tags text[],
  likes integer default 0,
  pinned boolean default false,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Seed knowledge cards
insert into knowledge_cards (seg, category, title, type, author_name, content, tags, likes, pinned) values
  ('stock','Pricing','Walkaway Pricing — Field Reference Card','Best Practice','Cooper RSM Team','Never quote from memory — always reference current floor pricing data before the call. Present the business case first, then the number.',array['pricing','distributor'],14,true),
  ('stock','Promotions','Top 10 Promo Strategies That Work','Guide','David Park — RSM Pacific','Pre-commit distributors 6 weeks before the cycle opens. Place MRAM kits at every Tier 1 location. Use inside sales for daily promo tracking.',array['promos','MRAM'],22,true),
  ('spec','VE Defense','How to Defend a CLS Spec from Value Engineering','Best Practice','Emily Walsh — RSM NE','Call the LD/EE immediately, not the contractor. Lead with photometric performance. Bring a layout comparison showing what gets lost.',array['VE defense','specification'],31,true),
  ('spec','Tools','LEX ASOW Report — Weekly Interpretation Guide','Guide','Cooper Training Team','Every Monday: open ASOW, sort by gap to potential. Top 5 gaps = this week spec outreach targets. Share with RSM weekly.',array['LEX','ASOW'],18,false),
  ('industrial','Nemalux','Nemalux Door Opener Playbook','Playbook','Carlos Rivera — RSM Gulf','Identify food processing, chemical, or aerospace facility. Request facility walk with maintenance director. Bring Nemalux Class I Div 2 sample.',array['Nemalux','hazardous'],27,true),
  ('connected','WLX','WLX Demo — 10-Minute Script','Template','Brian Moore — RSM Central','Minutes 1-2: Ask what frustrates them. Minutes 3-5: Show occupancy sensing live. Minutes 6-8: Demo daylight harvesting. Minutes 9-10: Leave the case on-site.',array['WLX','demo'],35,true)
on conflict do nothing;

-- 9. FORUM POSTS
create table if not exists forum_posts (
  id uuid primary key default gen_random_uuid(),
  seg text not null default 'general',
  title text not null,
  body text not null,
  author_id uuid references profiles(id),
  author_name text,
  author_role text,
  author_agency text,
  tags text[],
  pinned boolean default false,
  best_answer_id uuid,
  views integer default 0,
  created_at timestamptz default now()
);

-- Seed forum posts
insert into forum_posts (seg, title, body, author_name, author_role, author_agency, tags, pinned, views) values
  ('stock','Best approach to get distributors to adopt Walkaway Pricing?','We have been struggling to get Tier 2 distributors to use the methodology consistently. What has worked for other agencies?','Patrick Sullivan','owner','West 1',array['pricing','distributor'],true,47),
  ('spec','How do you get specifiers to attend CEU events consistently?','We have hosted 3 CEUs this quarter but attendance is inconsistent. Any best practices for improving show rates?','George Hart','owner','NE 1',array['CEU','specifier'],false,38),
  ('connected','WLX vs competitor — how do you handle the price objection?','We keep running into: WLX is 15-20% more than the competitor system. How are others handling this?','Marcus Bell','owner','Gulf 1',array['WLX','controls'],true,62),
  ('general','What is the most effective way to prepare for a Cooper planning meeting?','We have our quarterly planning meeting coming up. What should we bring and how do agencies get the most value?','Patrick Sullivan','owner','West 1',array['planning','quarterly'],false,54)
on conflict do nothing;

-- 10. FORUM REPLIES
create table if not exists forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references forum_posts(id) on delete cascade,
  parent_reply_id uuid references forum_replies(id),
  author_id uuid references profiles(id),
  author_name text,
  author_role text,
  author_agency text,
  body text not null,
  votes integer default 0,
  created_at timestamptz default now()
);

-- 11. FORUM VOTES
create table if not exists forum_votes (
  id uuid primary key default gen_random_uuid(),
  reply_id uuid references forum_replies(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(reply_id, user_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table agencies enable row level security;
alter table profiles enable row level security;
alter table scores enable row level security;
alter table actions enable row level security;
alter table action_comments enable row level security;
alter table annual_actions enable row level security;
alter table annual_action_weeks enable row level security;
alter table knowledge_cards enable row level security;
alter table forum_posts enable row level security;
alter table forum_replies enable row level security;
alter table forum_votes enable row level security;

-- AGENCIES: all authenticated users can read
create policy "agencies_read" on agencies for select to authenticated using (true);

-- PROFILES: users can read all profiles, update own
create policy "profiles_read" on profiles for select to authenticated using (true);
create policy "profiles_update_own" on profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert to authenticated with check (auth.uid() = id);

-- SCORES: all authenticated can read; admin/rsm/vp can write
create policy "scores_read" on scores for select to authenticated using (true);
create policy "scores_write" on scores for all to authenticated
  using ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'))
  with check ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'));

-- ACTIONS: all authenticated can read; admin/rsm/vp can write
create policy "actions_read" on actions for select to authenticated using (true);
create policy "actions_write" on actions for all to authenticated
  using ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'))
  with check ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'));

-- ACTION COMMENTS: all authenticated can read and insert
create policy "action_comments_read" on action_comments for select to authenticated using (true);
create policy "action_comments_insert" on action_comments for insert to authenticated with check (true);

-- ANNUAL ACTIONS: all authenticated can read; admin/rsm/vp can write
create policy "annual_actions_read" on annual_actions for select to authenticated using (true);
create policy "annual_actions_write" on annual_actions for all to authenticated
  using ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'))
  with check ((select role from profiles where id = auth.uid()) in ('admin','rsm','vp'));

-- ANNUAL ACTION WEEKS: all authenticated can read and update
create policy "annual_weeks_read" on annual_action_weeks for select to authenticated using (true);
create policy "annual_weeks_write" on annual_action_weeks for all to authenticated using (true) with check (true);

-- KNOWLEDGE: all authenticated can read; all can insert; owner or admin can update/delete
create policy "knowledge_read" on knowledge_cards for select to authenticated using (true);
create policy "knowledge_insert" on knowledge_cards for insert to authenticated with check (true);
create policy "knowledge_update" on knowledge_cards for update to authenticated
  using (created_by = auth.uid() or (select role from profiles where id = auth.uid()) = 'admin');
create policy "knowledge_delete" on knowledge_cards for delete to authenticated
  using (created_by = auth.uid() or (select role from profiles where id = auth.uid()) = 'admin');

-- FORUM: all authenticated can read and post
create policy "forum_posts_read" on forum_posts for select to authenticated using (true);
create policy "forum_posts_insert" on forum_posts for insert to authenticated with check (true);
create policy "forum_posts_update" on forum_posts for update to authenticated
  using (author_id = auth.uid() or (select role from profiles where id = auth.uid()) in ('admin','rsm','vp'));

create policy "forum_replies_read" on forum_replies for select to authenticated using (true);
create policy "forum_replies_insert" on forum_replies for insert to authenticated with check (true);

create policy "forum_votes_read" on forum_votes for select to authenticated using (true);
create policy "forum_votes_insert" on forum_votes for insert to authenticated with check (user_id = auth.uid());
create policy "forum_votes_delete" on forum_votes for delete to authenticated using (user_id = auth.uid());

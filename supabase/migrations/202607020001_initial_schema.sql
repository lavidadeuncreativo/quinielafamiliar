create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table public.participants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  paid boolean not null default false,
  entry_amount integer not null default 200 check (entry_amount >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  stage text not null,
  home_team text not null,
  away_team text not null,
  kickoff_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'completed', 'excluded')),
  home_score_90 integer check (home_score_90 is null or home_score_90 >= 0),
  away_score_90 integer check (away_score_90 is null or away_score_90 >= 0),
  advancing_team text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint completed_matches_have_scores check (
    status <> 'completed' or (home_score_90 is not null and away_score_90 is not null)
  ),
  constraint drawn_completed_matches_have_advancing_team check (
    status <> 'completed'
    or home_score_90 is null
    or away_score_90 is null
    or home_score_90 <> away_score_90
    or advancing_team is not null
  )
);

create table public.predictions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  predicted_home_score integer check (predicted_home_score is null or predicted_home_score >= 0),
  predicted_away_score integer check (predicted_away_score is null or predicted_away_score >= 0),
  predicted_advancing_team text,
  submitted_at timestamptz,
  status text not null default 'valid' check (status in ('valid', 'late', 'missing', 'invalidated')),
  source text not null default 'whatsapp' check (source in ('whatsapp', 'image', 'admin')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (participant_id, match_id)
);

create table public.prediction_scores (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null unique references public.predictions(id) on delete cascade,
  exact_score_points integer not null default 0 check (exact_score_points in (0, 3)),
  outcome_points integer not null default 0 check (outcome_points in (0, 1)),
  total_points integer not null default 0 check (total_points between 0 and 4),
  reason text not null,
  score_status text not null default 'scored' check (score_status in ('scored', 'nc', 'pending')),
  calculation_version text not null,
  calculated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  before_data jsonb,
  after_data jsonb,
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index participants_slug_idx on public.participants(slug);
create index participants_active_idx on public.participants(active);
create index matches_status_kickoff_idx on public.matches(status, kickoff_at);
create index matches_external_id_idx on public.matches(external_id);
create index predictions_participant_idx on public.predictions(participant_id);
create index predictions_match_idx on public.predictions(match_id);
create index prediction_scores_prediction_idx on public.prediction_scores(prediction_id);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger participants_set_updated_at
before update on public.participants
for each row execute function public.set_updated_at();

create trigger matches_set_updated_at
before update on public.matches
for each row execute function public.set_updated_at();

create trigger predictions_set_updated_at
before update on public.predictions
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.participants enable row level security;
alter table public.matches enable row level security;
alter table public.predictions enable row level security;
alter table public.prediction_scores enable row level security;
alter table public.audit_logs enable row level security;
alter table public.app_settings enable row level security;

create policy "Profiles are visible to their owner"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "Profiles can be managed by admins"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read active participants"
on public.participants for select
to anon, authenticated
using (active = true or public.is_admin());

create policy "Admins can manage participants"
on public.participants for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read matches"
on public.matches for select
to anon, authenticated
using (true);

create policy "Admins can manage matches"
on public.matches for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read predictions"
on public.predictions for select
to anon, authenticated
using (true);

create policy "Admins can manage predictions"
on public.predictions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read prediction scores"
on public.prediction_scores for select
to anon, authenticated
using (true);

create policy "Admins can manage prediction scores"
on public.prediction_scores for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read sanitized audit history"
on public.audit_logs for select
to anon, authenticated
using (true);

create policy "Admins can create audit logs"
on public.audit_logs for insert
to authenticated
with check (public.is_admin());

create policy "Admins can read all settings"
on public.app_settings for select
to anon, authenticated
using (true);

create policy "Admins can manage settings"
on public.app_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

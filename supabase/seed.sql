insert into public.app_settings (key, value)
values
  ('quiniela', '{"entryAmount":200,"prizePool":1800,"currency":"MXN","prizes":[{"place":"Primer lugar","amount":1000},{"place":"Segundo lugar","amount":500},{"place":"Tercer lugar","amount":300}],"lastUpdatedAt":"2026-07-02T12:00:00.000Z"}')
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.participants (name, slug, paid, entry_amount, active)
values
  ('Israel Cabrera', 'israel-cabrera', true, 200, true),
  ('Isra chico', 'isra-chico', true, 200, true),
  ('Liz Flores', 'liz-flores', true, 200, true),
  ('Rebeca Granados', 'rebeca-granados', true, 200, true),
  ('Tío Alfre', 'tio-alfre', true, 200, true),
  ('Alfredito', 'alfredito', true, 200, true),
  ('Nuria', 'nuria', true, 200, true),
  ('Rebe mamá', 'rebe-mama', true, 200, true),
  ('Pedro', 'pedro', true, 200, true)
on conflict (slug) do update
set name = excluded.name,
    paid = excluded.paid,
    entry_amount = excluded.entry_amount,
    active = excluded.active,
    updated_at = now();

insert into public.matches (
  external_id,
  stage,
  home_team,
  away_team,
  kickoff_at,
  status,
  home_score_90,
  away_score_90,
  advancing_team,
  completed_at
)
values
  ('sudafrica-canada', 'Eliminatoria', 'Sudáfrica', 'Canadá', '2026-06-11T20:00:00Z', 'excluded', null, null, null, null),
  ('brasil-japon', 'Eliminatoria', 'Brasil', 'Japón', '2026-06-12T18:00:00Z', 'completed', 2, 1, null, '2026-06-12T18:00:00Z'),
  ('alemania-paraguay', 'Eliminatoria', 'Alemania', 'Paraguay', '2026-06-13T18:00:00Z', 'completed', 1, 1, 'Paraguay', '2026-06-13T18:00:00Z'),
  ('paises-bajos-marruecos', 'Eliminatoria', 'Países Bajos', 'Marruecos', '2026-06-14T18:00:00Z', 'completed', 1, 1, 'Marruecos', '2026-06-14T18:00:00Z'),
  ('costa-de-marfil-noruega', 'Eliminatoria', 'Costa de Marfil', 'Noruega', '2026-06-15T18:00:00Z', 'completed', 1, 2, null, '2026-06-15T18:00:00Z'),
  ('francia-suecia', 'Eliminatoria', 'Francia', 'Suecia', '2026-06-16T18:00:00Z', 'completed', 3, 0, null, '2026-06-16T18:00:00Z'),
  ('mexico-ecuador', 'Eliminatoria', 'México', 'Ecuador', '2026-06-17T18:00:00Z', 'completed', 2, 0, null, '2026-06-17T18:00:00Z'),
  ('inglaterra-rd-congo', 'Eliminatoria', 'Inglaterra', 'RD Congo', '2026-06-18T18:00:00Z', 'completed', 2, 1, null, '2026-06-18T18:00:00Z'),
  ('belgica-senegal', 'Eliminatoria', 'Bélgica', 'Senegal', '2026-06-19T18:00:00Z', 'completed', 2, 2, 'Bélgica', '2026-06-19T18:00:00Z'),
  ('estados-unidos-bosnia', 'Eliminatoria', 'Estados Unidos', 'Bosnia y Herzegovina', '2026-06-20T18:00:00Z', 'completed', 2, 0, null, '2026-06-20T18:00:00Z'),
  ('argentina-portugal', 'Eliminatoria', 'Argentina', 'Portugal', '2026-07-03T21:00:00Z', 'scheduled', null, null, null, null)
on conflict (external_id) do update
set stage = excluded.stage,
    home_team = excluded.home_team,
    away_team = excluded.away_team,
    kickoff_at = excluded.kickoff_at,
    status = excluded.status,
    home_score_90 = excluded.home_score_90,
    away_score_90 = excluded.away_score_90,
    advancing_team = excluded.advancing_team,
    completed_at = excluded.completed_at,
    updated_at = now();

with prediction_input (participant_slug, match_external_id, home_score, away_score, advancing_team) as (
  values
    ('israel-cabrera', 'sudafrica-canada', 1, 0, null),
    ('israel-cabrera', 'brasil-japon', 2, 1, null),
    ('israel-cabrera', 'alemania-paraguay', 1, 1, 'Paraguay'),
    ('israel-cabrera', 'paises-bajos-marruecos', 1, 1, 'Países Bajos'),
    ('israel-cabrera', 'costa-de-marfil-noruega', 0, 1, null),
    ('israel-cabrera', 'francia-suecia', 2, 0, null),
    ('israel-cabrera', 'mexico-ecuador', 1, 0, null),
    ('israel-cabrera', 'inglaterra-rd-congo', 1, 0, null),
    ('israel-cabrera', 'belgica-senegal', 1, 1, 'Bélgica'),
    ('israel-cabrera', 'estados-unidos-bosnia', 1, 0, null),
    ('isra-chico', 'sudafrica-canada', 0, 1, null),
    ('isra-chico', 'brasil-japon', 2, 1, null),
    ('isra-chico', 'alemania-paraguay', 1, 1, null),
    ('isra-chico', 'paises-bajos-marruecos', 2, 2, 'Marruecos'),
    ('isra-chico', 'costa-de-marfil-noruega', 0, 2, null),
    ('isra-chico', 'francia-suecia', 1, 0, null),
    ('isra-chico', 'mexico-ecuador', 1, 1, null),
    ('isra-chico', 'inglaterra-rd-congo', 2, 0, null),
    ('isra-chico', 'belgica-senegal', 3, 3, null),
    ('isra-chico', 'estados-unidos-bosnia', 1, 0, null),
    ('liz-flores', 'sudafrica-canada', 1, 1, null),
    ('liz-flores', 'brasil-japon', 2, 1, null),
    ('liz-flores', 'alemania-paraguay', 1, 1, 'Alemania'),
    ('liz-flores', 'paises-bajos-marruecos', 0, 0, 'Marruecos'),
    ('liz-flores', 'costa-de-marfil-noruega', 2, 1, null),
    ('liz-flores', 'francia-suecia', 1, 0, null),
    ('liz-flores', 'mexico-ecuador', 3, 1, null),
    ('liz-flores', 'inglaterra-rd-congo', 1, 1, null),
    ('liz-flores', 'belgica-senegal', 1, 1, 'Senegal'),
    ('liz-flores', 'estados-unidos-bosnia', 1, 0, null),
    ('rebeca-granados', 'sudafrica-canada', 2, 0, null),
    ('rebeca-granados', 'brasil-japon', 2, 1, null),
    ('rebeca-granados', 'alemania-paraguay', 2, 2, 'Paraguay'),
    ('rebeca-granados', 'paises-bajos-marruecos', 2, 2, 'Marruecos'),
    ('rebeca-granados', 'costa-de-marfil-noruega', 1, 3, null),
    ('rebeca-granados', 'francia-suecia', 2, 0, null),
    ('rebeca-granados', 'mexico-ecuador', 0, 1, null),
    ('rebeca-granados', 'inglaterra-rd-congo', 3, 1, null),
    ('rebeca-granados', 'belgica-senegal', 3, 3, 'Bélgica'),
    ('rebeca-granados', 'estados-unidos-bosnia', 1, 1, null),
    ('tio-alfre', 'sudafrica-canada', 0, 2, null),
    ('tio-alfre', 'brasil-japon', 2, 1, null),
    ('tio-alfre', 'alemania-paraguay', 2, 2, 'Paraguay'),
    ('tio-alfre', 'paises-bajos-marruecos', 1, 1, 'Marruecos'),
    ('tio-alfre', 'costa-de-marfil-noruega', 2, 1, null),
    ('tio-alfre', 'francia-suecia', 2, 0, null),
    ('tio-alfre', 'mexico-ecuador', 1, 0, null),
    ('tio-alfre', 'inglaterra-rd-congo', 1, 1, null),
    ('tio-alfre', 'belgica-senegal', 1, 1, 'Bélgica'),
    ('tio-alfre', 'estados-unidos-bosnia', 1, 1, null),
    ('alfredito', 'sudafrica-canada', 1, 0, null),
    ('alfredito', 'brasil-japon', 2, 1, null),
    ('alfredito', 'alemania-paraguay', 0, 0, 'Paraguay'),
    ('alfredito', 'paises-bajos-marruecos', 2, 2, 'Países Bajos'),
    ('alfredito', 'costa-de-marfil-noruega', 0, 1, null),
    ('alfredito', 'francia-suecia', 1, 0, null),
    ('alfredito', 'mexico-ecuador', 1, 2, null),
    ('alfredito', 'inglaterra-rd-congo', 2, 0, null),
    ('alfredito', 'belgica-senegal', 1, 1, 'Bélgica'),
    ('alfredito', 'estados-unidos-bosnia', 1, 1, null),
    ('nuria', 'sudafrica-canada', 1, 2, null),
    ('nuria', 'brasil-japon', 2, 1, null),
    ('nuria', 'alemania-paraguay', 2, 2, 'Alemania'),
    ('nuria', 'paises-bajos-marruecos', 2, 2, 'Marruecos'),
    ('nuria', 'costa-de-marfil-noruega', 1, 0, null),
    ('nuria', 'francia-suecia', 2, 0, null),
    ('nuria', 'mexico-ecuador', 0, 0, null),
    ('nuria', 'inglaterra-rd-congo', 1, 0, null),
    ('nuria', 'belgica-senegal', 3, 3, 'Bélgica'),
    ('nuria', 'estados-unidos-bosnia', 1, 1, null),
    ('rebe-mama', 'sudafrica-canada', 1, 1, null),
    ('rebe-mama', 'brasil-japon', 1, 0, null),
    ('rebe-mama', 'alemania-paraguay', 2, 2, 'Paraguay'),
    ('rebe-mama', 'paises-bajos-marruecos', 0, 0, 'Marruecos'),
    ('rebe-mama', 'costa-de-marfil-noruega', 0, 1, null),
    ('rebe-mama', 'francia-suecia', 1, 0, null),
    ('rebe-mama', 'mexico-ecuador', 1, 0, null),
    ('rebe-mama', 'inglaterra-rd-congo', 1, 1, null),
    ('rebe-mama', 'belgica-senegal', 1, 1, 'Bélgica'),
    ('rebe-mama', 'estados-unidos-bosnia', 0, 0, null),
    ('pedro', 'sudafrica-canada', 0, 0, null),
    ('pedro', 'brasil-japon', 1, 0, null),
    ('pedro', 'alemania-paraguay', 2, 2, 'Alemania'),
    ('pedro', 'paises-bajos-marruecos', 2, 2, 'Marruecos'),
    ('pedro', 'costa-de-marfil-noruega', 1, 0, null),
    ('pedro', 'francia-suecia', 2, 0, null),
    ('pedro', 'mexico-ecuador', 0, 1, null),
    ('pedro', 'inglaterra-rd-congo', 1, 1, null),
    ('pedro', 'belgica-senegal', 3, 3, 'Bélgica'),
    ('pedro', 'estados-unidos-bosnia', 0, 0, null)
)
insert into public.predictions (
  participant_id,
  match_id,
  predicted_home_score,
  predicted_away_score,
  predicted_advancing_team,
  submitted_at,
  status,
  source
)
select
  participants.id,
  matches.id,
  prediction_input.home_score,
  prediction_input.away_score,
  prediction_input.advancing_team,
  '2026-06-10T23:00:00Z',
  'valid',
  'whatsapp'
from prediction_input
join public.participants on participants.slug = prediction_input.participant_slug
join public.matches on matches.external_id = prediction_input.match_external_id
on conflict (participant_id, match_id) do update
set predicted_home_score = excluded.predicted_home_score,
    predicted_away_score = excluded.predicted_away_score,
    predicted_advancing_team = excluded.predicted_advancing_team,
    submitted_at = excluded.submitted_at,
    status = excluded.status,
    source = excluded.source,
    updated_at = now();

with base as (
  select
    predictions.id as prediction_id,
    matches.status as match_status,
    predictions.status as prediction_status,
    matches.home_team,
    matches.away_team,
    matches.home_score_90,
    matches.away_score_90,
    matches.advancing_team,
    predictions.predicted_home_score,
    predictions.predicted_away_score,
    predictions.predicted_advancing_team,
    case
      when matches.home_score_90 > matches.away_score_90 then matches.home_team
      when matches.away_score_90 > matches.home_score_90 then matches.away_team
      else null
    end as official_winner,
    case
      when predictions.predicted_home_score > predictions.predicted_away_score then matches.home_team
      when predictions.predicted_away_score > predictions.predicted_home_score then matches.away_team
      else null
    end as predicted_winner,
    (
      predictions.predicted_home_score = matches.home_score_90
      and predictions.predicted_away_score = matches.away_score_90
    ) as exact_score
  from public.predictions
  join public.matches on matches.id = predictions.match_id
),
calculated as (
  select
    prediction_id,
    case
      when match_status = 'excluded' then 0
      when match_status <> 'completed' then 0
      when prediction_status <> 'valid' then 0
      when home_score_90 is null or away_score_90 is null then 0
      when predicted_home_score is null or predicted_away_score is null then 0
      when exact_score then 3
      else 0
    end as exact_score_points,
    case
      when match_status = 'excluded' then 0
      when match_status <> 'completed' then 0
      when prediction_status <> 'valid' then 0
      when home_score_90 is null or away_score_90 is null then 0
      when predicted_home_score is null or predicted_away_score is null then 0
      when official_winner is not null and exact_score then 0
      when official_winner is not null and lower(trim(predicted_winner)) = lower(trim(official_winner)) then 1
      when official_winner is null
        and advancing_team is not null
        and lower(trim(coalesce(predicted_advancing_team, predicted_winner))) = lower(trim(advancing_team)) then 1
      else 0
    end as outcome_points,
    case
      when match_status = 'excluded' then 'nc'
      when match_status <> 'completed' then 'pending'
      when prediction_status <> 'valid' then 'nc'
      when home_score_90 is null or away_score_90 is null then 'pending'
      else 'scored'
    end as score_status
  from base
),
explained as (
  select
    prediction_id,
    exact_score_points,
    outcome_points,
    exact_score_points + outcome_points as total_points,
    score_status,
    case
      when score_status = 'nc' then 'NC: partido excluido, tardio, faltante o invalidado.'
      when score_status = 'pending' then 'Pendiente: el partido aun no tiene resultado oficial.'
      when exact_score_points = 3 and outcome_points = 1 then 'Empate exacto y clasificado correcto: 4 puntos.'
      when exact_score_points = 3 then 'Marcador exacto: 3 puntos.'
      when outcome_points = 1 then 'Acierto simple o clasificado correcto: 1 punto.'
      else 'Sin puntos: no se acerto marcador, ganador ni clasificado.'
    end as reason
  from calculated
)
insert into public.prediction_scores (
  prediction_id,
  exact_score_points,
  outcome_points,
  total_points,
  reason,
  score_status,
  calculation_version,
  calculated_at
)
select
  prediction_id,
  exact_score_points,
  outcome_points,
  total_points,
  reason,
  score_status,
  'mundial-2026-v1',
  '2026-07-02T12:00:00Z'
from explained
on conflict (prediction_id) do update
set exact_score_points = excluded.exact_score_points,
    outcome_points = excluded.outcome_points,
    total_points = excluded.total_points,
    reason = excluded.reason,
    score_status = excluded.score_status,
    calculation_version = excluded.calculation_version,
    calculated_at = excluded.calculated_at;

insert into public.audit_logs (action, entity_type, entity_id, before_data, after_data, reason, created_at)
values
  ('bulk_seed', 'matches', 'resultados-iniciales', null, null, 'Carga inicial de resultados registrados.', '2026-07-02T12:00:00Z'),
  ('bulk_seed', 'predictions', 'pronosticos-iniciales', null, null, 'Carga inicial de pronosticos familiares.', '2026-07-02T12:00:00Z'),
  ('update', 'matches', 'sudafrica-canada', null, null, 'Partido excluido conforme a reglas de la quiniela.', '2026-07-02T12:00:00Z'),
  ('recalculate', 'prediction_scores', 'all', null, '{"calculationVersion":"mundial-2026-v1"}', 'Recalculo inicial con version mundial-2026-v1.', '2026-07-02T12:00:00Z');

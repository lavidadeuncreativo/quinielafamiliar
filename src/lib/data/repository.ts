import type {
  AuditLog,
  MatchRecord,
  Participant,
  Prediction,
  PredictionBreakdown,
  PredictionScore,
  PublicSnapshot
} from "@/lib/types";
import { publicSnapshot as seedSnapshot } from "./seed";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { buildStandingsWithRecentMovement } from "@/lib/scoring/standings";
import { recalculateAllScores } from "@/lib/scoring/recalculate";

type DbParticipant = {
  id: string;
  name: string;
  slug: string;
  paid: boolean;
  entry_amount: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type DbMatch = {
  id: string;
  external_id: string | null;
  stage: string;
  home_team: string;
  away_team: string;
  kickoff_at: string;
  status: MatchRecord["status"];
  home_score_90: number | null;
  away_score_90: number | null;
  advancing_team: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

type DbPrediction = {
  id: string;
  participant_id: string;
  match_id: string;
  predicted_home_score: number | null;
  predicted_away_score: number | null;
  predicted_advancing_team: string | null;
  submitted_at: string | null;
  status: Prediction["status"];
  source: Prediction["source"];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type DbScore = {
  id: string;
  prediction_id: string;
  exact_score_points: number;
  outcome_points: number;
  total_points: number;
  reason: string;
  score_status: PredictionScore["status"];
  calculation_version: string;
  calculated_at: string;
};

type DbAudit = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  reason: string;
  created_at: string;
};

export async function getPublicSnapshot(): Promise<PublicSnapshot> {
  if (!isSupabaseConfigured()) {
    return seedSnapshot;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [
      participantsResult,
      matchesResult,
      predictionsResult,
      scoresResult,
      auditResult,
      settingsResult
    ] = await Promise.all([
      supabase.from("participants").select("*").order("name"),
      supabase.from("matches").select("*").order("kickoff_at"),
      supabase.from("predictions").select("*"),
      supabase.from("prediction_scores").select("*"),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(40),
      supabase.from("app_settings").select("*").eq("key", "quiniela").maybeSingle()
    ]);

    if (
      participantsResult.error ||
      matchesResult.error ||
      predictionsResult.error ||
      scoresResult.error ||
      auditResult.error
    ) {
      return seedSnapshot;
    }

    const participants = (participantsResult.data ?? []).map(dbParticipantToDomain);
    const matches = (matchesResult.data ?? []).map(dbMatchToDomain);
    const predictions = (predictionsResult.data ?? []).map(dbPredictionToDomain);
    const dbScores = (scoresResult.data ?? []).map(dbScoreToDomain);
    const scores = dbScores.length > 0 ? dbScores : recalculateAllScores(matches, predictions);
    const settingsValue = settingsResult.data?.value as PublicSnapshot["settings"] | undefined;

    return {
      participants,
      matches,
      predictions,
      scores,
      standings: buildStandingsWithRecentMovement(participants, matches, predictions, scores),
      auditLogs: (auditResult.data ?? []).map(dbAuditToDomain),
      settings: settingsValue ?? seedSnapshot.settings
    };
  } catch {
    return seedSnapshot;
  }
}

export function getLatestResult(snapshot: PublicSnapshot): MatchRecord | null {
  return (
    snapshot.matches
      .filter((match) => match.status === "completed")
      .sort((left, right) => dateValue(right.completedAt ?? right.kickoffAt) - dateValue(left.completedAt ?? left.kickoffAt))[0] ??
    null
  );
}

export function getNextMatch(snapshot: PublicSnapshot): MatchRecord | null {
  return (
    snapshot.matches
      .filter((match) => match.status === "scheduled" || match.status === "live")
      .sort((left, right) => dateValue(left.kickoffAt) - dateValue(right.kickoffAt))[0] ?? null
  );
}

export function getParticipantBySlug(snapshot: PublicSnapshot, slug: string): Participant | null {
  return snapshot.participants.find((participant) => participant.slug === slug) ?? null;
}

export function getMatchById(snapshot: PublicSnapshot, id: string): MatchRecord | null {
  return snapshot.matches.find((match) => match.id === id || match.externalId === id) ?? null;
}

export function getParticipantBreakdown(
  snapshot: PublicSnapshot,
  participantSlug: string
): PredictionBreakdown[] {
  const participant = getParticipantBySlug(snapshot, participantSlug);
  if (!participant) return [];
  const scoreByPredictionId = new Map(snapshot.scores.map((score) => [score.predictionId, score]));

  return snapshot.matches.map((match) => {
    const prediction =
      snapshot.predictions.find(
        (item) => item.participantId === participant.id && item.matchId === match.id
      ) ?? null;

    return {
      participant,
      match,
      prediction,
      score: prediction ? scoreByPredictionId.get(prediction.id) ?? null : null
    };
  });
}

export function getMatchBreakdown(snapshot: PublicSnapshot, matchId: string): PredictionBreakdown[] {
  const match = getMatchById(snapshot, matchId);
  if (!match) return [];
  const scoreByPredictionId = new Map(snapshot.scores.map((score) => [score.predictionId, score]));

  return snapshot.participants.map((participant) => {
    const prediction =
      snapshot.predictions.find(
        (item) => item.participantId === participant.id && item.matchId === match.id
      ) ?? null;

    return {
      participant,
      match,
      prediction,
      score: prediction ? scoreByPredictionId.get(prediction.id) ?? null : null
    };
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDateTime(value: string | null): string {
  if (!value) return "Por definir";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City"
  }).format(new Date(value));
}

export function formatScore(match: MatchRecord): string {
  if (match.status === "excluded") return "Excluido";
  if (match.homeScore90 === null || match.awayScore90 === null) return "Programado";
  return `${match.homeScore90}-${match.awayScore90}`;
}

export function formatPrediction(prediction: Prediction | null): string {
  if (!prediction) return "NC";
  if (prediction.status !== "valid") return "NC";
  if (prediction.predictedHomeScore === null || prediction.predictedAwayScore === null) return "NC";
  return `${prediction.predictedHomeScore}-${prediction.predictedAwayScore}`;
}

export function statusLabel(status: MatchRecord["status"]): string {
  const labels = {
    scheduled: "Programado",
    live: "En vivo",
    completed: "Completado",
    excluded: "Excluido"
  } satisfies Record<MatchRecord["status"], string>;

  return labels[status];
}

export function paymentSummary(snapshot: PublicSnapshot) {
  const paid = snapshot.participants.filter((participant) => participant.paid).length;
  const total = snapshot.participants.length;
  const collected = snapshot.participants.reduce(
    (sum, participant) => sum + (participant.paid ? participant.entryAmount : 0),
    0
  );

  return { paid, total, collected };
}

function dateValue(value: string): number {
  return new Date(value).getTime();
}

function dbParticipantToDomain(row: DbParticipant): Participant {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    paid: row.paid,
    entryAmount: row.entry_amount,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function dbMatchToDomain(row: DbMatch): MatchRecord {
  return {
    id: row.id,
    externalId: row.external_id,
    stage: row.stage,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    kickoffAt: row.kickoff_at,
    status: row.status,
    homeScore90: row.home_score_90,
    awayScore90: row.away_score_90,
    advancingTeam: row.advancing_team,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function dbPredictionToDomain(row: DbPrediction): Prediction {
  return {
    id: row.id,
    participantId: row.participant_id,
    matchId: row.match_id,
    predictedHomeScore: row.predicted_home_score,
    predictedAwayScore: row.predicted_away_score,
    predictedAdvancingTeam: row.predicted_advancing_team,
    submittedAt: row.submitted_at,
    status: row.status,
    source: row.source,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function dbScoreToDomain(row: DbScore): PredictionScore {
  return {
    id: row.id,
    predictionId: row.prediction_id,
    exactScorePoints: row.exact_score_points,
    outcomePoints: row.outcome_points,
    totalPoints: row.total_points,
    reason: row.reason,
    status: row.score_status,
    calculationVersion: row.calculation_version,
    calculatedAt: row.calculated_at
  };
}

function dbAuditToDomain(row: DbAudit): AuditLog {
  return {
    id: row.id,
    actorId: row.actor_id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    beforeData: row.before_data,
    afterData: row.after_data,
    reason: row.reason,
    createdAt: row.created_at
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { MatchRecord, Prediction } from "@/lib/types";
import { recalculateAllScores } from "@/lib/scoring/recalculate";
import { requireAdmin } from "./require-admin";
import { matchSchema, participantSchema, predictionSchema, quickResultSchema } from "./schemas";

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

export async function saveParticipantAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const parsed = participantSchema.parse(Object.fromEntries(formData));
  const id = parsed.id || undefined;
  const payload = {
    name: parsed.name,
    slug: parsed.slug,
    paid: parsed.paid,
    entry_amount: parsed.entry_amount,
    active: parsed.active
  };

  const before = id
    ? await supabase.from("participants").select("*").eq("id", id).maybeSingle()
    : { data: null };

  const result = id
    ? await supabase.from("participants").update(payload).eq("id", id).select("id").single()
    : await supabase.from("participants").insert(payload).select("id").single();

  if (result.error) throw new Error(result.error.message);

  await insertAuditLog({
    action: id ? "update" : "create",
    entityType: "participants",
    entityId: result.data.id,
    actorId: user.id,
    beforeData: before.data,
    afterData: payload,
    reason: parsed.reason || (id ? "Actualizacion administrativa." : "Alta de participante.")
  });

  revalidatePublicAndAdmin();
  redirect("/admin/participantes");
}

export async function saveMatchAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const parsed = matchSchema.parse(Object.fromEntries(formData));
  const id = parsed.id || undefined;

  if (id && !parsed.reason) {
    throw new Error("Las correcciones de partidos requieren una razon.");
  }

  const payload = {
    external_id: parsed.external_id || null,
    stage: parsed.stage,
    home_team: parsed.home_team,
    away_team: parsed.away_team,
    kickoff_at: parsed.kickoff_at,
    status: parsed.status,
    home_score_90: parsed.home_score_90,
    away_score_90: parsed.away_score_90,
    advancing_team: parsed.advancing_team || null,
    completed_at: parsed.status === "completed" ? new Date().toISOString() : null
  };

  const before = id
    ? await supabase.from("matches").select("*").eq("id", id).maybeSingle()
    : { data: null };
  const result = id
    ? await supabase.from("matches").update(payload).eq("id", id).select("id").single()
    : await supabase.from("matches").insert(payload).select("id").single();

  if (result.error) throw new Error(result.error.message);

  await insertAuditLog({
    action: id ? "update" : "create",
    entityType: "matches",
    entityId: result.data.id,
    actorId: user.id,
    beforeData: before.data,
    afterData: payload,
    reason: parsed.reason || "Alta de partido."
  });

  if (payload.status === "completed" || payload.status === "excluded") {
    await recalculateScoresForCurrentDatabase("Recalculo posterior a cambio de partido.");
  }

  revalidatePublicAndAdmin();
  redirect("/admin/partidos");
}

export async function savePredictionAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const parsed = predictionSchema.parse(Object.fromEntries(formData));
  const id = parsed.id || undefined;

  if (id && !parsed.reason) {
    throw new Error("Las correcciones de pronosticos requieren una razon.");
  }

  const payload = {
    participant_id: parsed.participant_id,
    match_id: parsed.match_id,
    predicted_home_score: parsed.predicted_home_score,
    predicted_away_score: parsed.predicted_away_score,
    predicted_advancing_team: parsed.predicted_advancing_team || null,
    submitted_at: parsed.submitted_at || null,
    status: parsed.status,
    source: parsed.source,
    notes: parsed.notes || null
  };

  const before = id
    ? await supabase.from("predictions").select("*").eq("id", id).maybeSingle()
    : { data: null };
  const result = id
    ? await supabase.from("predictions").update(payload).eq("id", id).select("id").single()
    : await supabase.from("predictions").insert(payload).select("id").single();

  if (result.error) throw new Error(result.error.message);

  await insertAuditLog({
    action: id ? "update" : "create",
    entityType: "predictions",
    entityId: result.data.id,
    actorId: user.id,
    beforeData: before.data,
    afterData: payload,
    reason: parsed.reason || "Alta de pronostico."
  });

  await recalculateScoresForCurrentDatabase("Recalculo posterior a cambio de pronostico.");
  revalidatePublicAndAdmin();
  redirect("/admin/pronosticos");
}

export async function saveQuickResultAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const parsed = quickResultSchema.parse(Object.fromEntries(formData));
  const { data: before } = await supabase.from("matches").select("*").eq("id", parsed.match_id).maybeSingle();

  const result = await supabase
    .from("matches")
    .update({
      status: "completed",
      home_score_90: parsed.home_score_90,
      away_score_90: parsed.away_score_90,
      advancing_team: parsed.advancing_team || null,
      completed_at: new Date().toISOString()
    })
    .eq("id", parsed.match_id)
    .select("id")
    .single();

  if (result.error) throw new Error(result.error.message);

  await insertAuditLog({
    action: "update_result",
    entityType: "matches",
    entityId: result.data.id,
    actorId: user.id,
    beforeData: before,
    afterData: {
      home_score_90: parsed.home_score_90,
      away_score_90: parsed.away_score_90,
      advancing_team: parsed.advancing_team || null
    },
    reason: parsed.reason
  });

  await recalculateScoresForCurrentDatabase("Recalculo posterior a resultado oficial.");
  revalidatePublicAndAdmin();
  redirect("/admin/partidos");
}

export async function recalculateScoresAction() {
  await requireAdmin();
  await recalculateScoresForCurrentDatabase("Recalculo manual solicitado por administrador.");
  revalidatePublicAndAdmin();
  redirect("/admin");
}

async function recalculateScoresForCurrentDatabase(reason: string) {
  const { supabase, user } = await requireAdmin();
  const [{ data: dbMatches, error: matchError }, { data: dbPredictions, error: predictionError }] =
    await Promise.all([
      supabase.from("matches").select("*"),
      supabase.from("predictions").select("*")
    ]);

  if (matchError) throw new Error(matchError.message);
  if (predictionError) throw new Error(predictionError.message);

  const scores = recalculateAllScores(
    (dbMatches ?? []).map(dbMatchToDomain),
    (dbPredictions ?? []).map(dbPredictionToDomain),
    new Date().toISOString()
  );

  const { error } = await supabase.from("prediction_scores").upsert(
    scores.map((score) => ({
      prediction_id: score.predictionId,
      exact_score_points: score.exactScorePoints,
      outcome_points: score.outcomePoints,
      total_points: score.totalPoints,
      reason: score.reason,
      score_status: score.status,
      calculation_version: score.calculationVersion,
      calculated_at: score.calculatedAt
    })),
    { onConflict: "prediction_id" }
  );

  if (error) throw new Error(error.message);

  await insertAuditLog({
    action: "recalculate",
    entityType: "prediction_scores",
    entityId: "all",
    actorId: user.id,
    beforeData: null,
    afterData: { score_count: scores.length },
    reason
  });
}

async function insertAuditLog(input: {
  action: string;
  entityType: string;
  entityId: string;
  actorId: string;
  beforeData: unknown;
  afterData: unknown;
  reason: string;
}) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    before_data: input.beforeData,
    after_data: input.afterData,
    reason: input.reason
  });

  if (error) throw new Error(error.message);
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

function revalidatePublicAndAdmin() {
  revalidatePath("/");
  revalidatePath("/tabla");
  revalidatePath("/partidos");
  revalidatePath("/auditoria");
  revalidatePath("/admin");
  revalidatePath("/admin/partidos");
  revalidatePath("/admin/pronosticos");
  revalidatePath("/admin/participantes");
  revalidatePath("/admin/auditoria");
}

import { z } from "zod";

const nullableScore = z.preprocess((value) => {
  if (value === "" || value === null || typeof value === "undefined") return null;
  return Number(value);
}, z.number().int().min(0).nullable());

const requiredScore = z.preprocess((value) => Number(value), z.number().int().min(0));
const checkbox = z.preprocess((value) => value === "true" || value === "on", z.boolean());

export const participantSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/),
  paid: checkbox.default(false),
  entry_amount: z.coerce.number().int().min(0),
  active: checkbox.default(true),
  reason: z.string().trim().optional()
});

export const matchSchema = z
  .object({
    id: z.string().uuid().optional().or(z.literal("")),
    external_id: z.string().trim().optional().or(z.literal("")),
    stage: z.string().trim().min(2),
    home_team: z.string().trim().min(2),
    away_team: z.string().trim().min(2),
    kickoff_at: z.string().trim().min(1),
    status: z.enum(["scheduled", "live", "completed", "excluded"]),
    home_score_90: nullableScore,
    away_score_90: nullableScore,
    advancing_team: z.string().trim().optional().or(z.literal("")),
    reason: z.string().trim().optional()
  })
  .superRefine((value, context) => {
    if (value.status === "completed" && (value.home_score_90 === null || value.away_score_90 === null)) {
      context.addIssue({
        code: "custom",
        path: ["home_score_90"],
        message: "Un partido completado requiere marcador a 90 minutos."
      });
    }

    if (
      value.status === "completed" &&
      value.home_score_90 !== null &&
      value.away_score_90 !== null &&
      value.home_score_90 === value.away_score_90 &&
      !value.advancing_team
    ) {
      context.addIssue({
        code: "custom",
        path: ["advancing_team"],
        message: "Un empate completado requiere equipo clasificado."
      });
    }
  });

export const predictionSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  participant_id: z.string().uuid(),
  match_id: z.string().uuid(),
  predicted_home_score: nullableScore,
  predicted_away_score: nullableScore,
  predicted_advancing_team: z.string().trim().optional().or(z.literal("")),
  submitted_at: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["valid", "late", "missing", "invalidated"]),
  source: z.enum(["whatsapp", "image", "admin"]),
  notes: z.string().trim().optional().or(z.literal("")),
  reason: z.string().trim().optional()
});

export const correctionReasonSchema = z.object({
  reason: z.string().trim().min(5)
});

export const quickResultSchema = z.object({
  match_id: z.string().uuid(),
  home_score_90: requiredScore,
  away_score_90: requiredScore,
  advancing_team: z.string().trim().optional().or(z.literal("")),
  reason: z.string().trim().min(5)
});

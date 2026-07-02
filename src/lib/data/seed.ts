import type { AuditLog, MatchRecord, Participant, Prediction, PublicSnapshot } from "@/lib/types";
import { recalculateAllScores } from "@/lib/scoring/recalculate";
import { buildStandingsWithRecentMovement } from "@/lib/scoring/standings";

const CREATED_AT = "2026-06-10T18:00:00.000Z";
export const LAST_UPDATED_AT = "2026-07-02T12:00:00.000Z";

export const participants: Participant[] = [
  participant("israel-cabrera", "Israel Cabrera"),
  participant("isra-chico", "Isra chico"),
  participant("liz-flores", "Liz Flores"),
  participant("rebeca-granados", "Rebeca Granados"),
  participant("tio-alfre", "Tío Alfre"),
  participant("alfredito", "Alfredito"),
  participant("nuria", "Nuria"),
  participant("rebe-mama", "Rebe mamá"),
  participant("pedro", "Pedro")
];

export const matches: MatchRecord[] = [
  excludedMatch("sudafrica-canada", "Sudáfrica", "Canadá", "2026-06-11T20:00:00.000Z"),
  completedMatch("brasil-japon", "Brasil", "Japón", "2026-06-12T18:00:00.000Z", 2, 1),
  completedMatch(
    "alemania-paraguay",
    "Alemania",
    "Paraguay",
    "2026-06-13T18:00:00.000Z",
    1,
    1,
    "Paraguay"
  ),
  completedMatch(
    "paises-bajos-marruecos",
    "Países Bajos",
    "Marruecos",
    "2026-06-14T18:00:00.000Z",
    1,
    1,
    "Marruecos"
  ),
  completedMatch(
    "costa-de-marfil-noruega",
    "Costa de Marfil",
    "Noruega",
    "2026-06-15T18:00:00.000Z",
    1,
    2
  ),
  completedMatch("francia-suecia", "Francia", "Suecia", "2026-06-16T18:00:00.000Z", 3, 0),
  completedMatch("mexico-ecuador", "México", "Ecuador", "2026-06-17T18:00:00.000Z", 2, 0),
  completedMatch(
    "inglaterra-rd-congo",
    "Inglaterra",
    "RD Congo",
    "2026-06-18T18:00:00.000Z",
    2,
    1
  ),
  completedMatch(
    "belgica-senegal",
    "Bélgica",
    "Senegal",
    "2026-06-19T18:00:00.000Z",
    2,
    2,
    "Bélgica"
  ),
  completedMatch(
    "estados-unidos-bosnia",
    "Estados Unidos",
    "Bosnia y Herzegovina",
    "2026-06-20T18:00:00.000Z",
    2,
    0
  ),
  scheduledMatch("argentina-portugal", "Argentina", "Portugal", "2026-07-03T21:00:00.000Z")
];

export const predictions: Prediction[] = [
  ...participantPredictions("israel-cabrera", [
    ["sudafrica-canada", 1, 0],
    ["brasil-japon", 2, 1],
    ["alemania-paraguay", 1, 1, "Paraguay"],
    ["paises-bajos-marruecos", 1, 1, "Países Bajos"],
    ["costa-de-marfil-noruega", 0, 1],
    ["francia-suecia", 2, 0],
    ["mexico-ecuador", 1, 0],
    ["inglaterra-rd-congo", 1, 0],
    ["belgica-senegal", 1, 1, "Bélgica"],
    ["estados-unidos-bosnia", 1, 0]
  ]),
  ...participantPredictions("isra-chico", [
    ["sudafrica-canada", 0, 1],
    ["brasil-japon", 2, 1],
    ["alemania-paraguay", 1, 1],
    ["paises-bajos-marruecos", 2, 2, "Marruecos"],
    ["costa-de-marfil-noruega", 0, 2],
    ["francia-suecia", 1, 0],
    ["mexico-ecuador", 1, 1],
    ["inglaterra-rd-congo", 2, 0],
    ["belgica-senegal", 3, 3],
    ["estados-unidos-bosnia", 1, 0]
  ]),
  ...participantPredictions("liz-flores", [
    ["sudafrica-canada", 1, 1],
    ["brasil-japon", 2, 1],
    ["alemania-paraguay", 1, 1, "Alemania"],
    ["paises-bajos-marruecos", 0, 0, "Marruecos"],
    ["costa-de-marfil-noruega", 2, 1],
    ["francia-suecia", 1, 0],
    ["mexico-ecuador", 3, 1],
    ["inglaterra-rd-congo", 1, 1],
    ["belgica-senegal", 1, 1, "Senegal"],
    ["estados-unidos-bosnia", 1, 0]
  ]),
  ...participantPredictions("rebeca-granados", [
    ["sudafrica-canada", 2, 0],
    ["brasil-japon", 2, 1],
    ["alemania-paraguay", 2, 2, "Paraguay"],
    ["paises-bajos-marruecos", 2, 2, "Marruecos"],
    ["costa-de-marfil-noruega", 1, 3],
    ["francia-suecia", 2, 0],
    ["mexico-ecuador", 0, 1],
    ["inglaterra-rd-congo", 3, 1],
    ["belgica-senegal", 3, 3, "Bélgica"],
    ["estados-unidos-bosnia", 1, 1]
  ]),
  ...participantPredictions("tio-alfre", [
    ["sudafrica-canada", 0, 2],
    ["brasil-japon", 2, 1],
    ["alemania-paraguay", 2, 2, "Paraguay"],
    ["paises-bajos-marruecos", 1, 1, "Marruecos"],
    ["costa-de-marfil-noruega", 2, 1],
    ["francia-suecia", 2, 0],
    ["mexico-ecuador", 1, 0],
    ["inglaterra-rd-congo", 1, 1],
    ["belgica-senegal", 1, 1, "Bélgica"],
    ["estados-unidos-bosnia", 1, 1]
  ]),
  ...participantPredictions("alfredito", [
    ["sudafrica-canada", 1, 0],
    ["brasil-japon", 2, 1],
    ["alemania-paraguay", 0, 0, "Paraguay"],
    ["paises-bajos-marruecos", 2, 2, "Países Bajos"],
    ["costa-de-marfil-noruega", 0, 1],
    ["francia-suecia", 1, 0],
    ["mexico-ecuador", 1, 2],
    ["inglaterra-rd-congo", 2, 0],
    ["belgica-senegal", 1, 1, "Bélgica"],
    ["estados-unidos-bosnia", 1, 1]
  ]),
  ...participantPredictions("nuria", [
    ["sudafrica-canada", 1, 2],
    ["brasil-japon", 2, 1],
    ["alemania-paraguay", 2, 2, "Alemania"],
    ["paises-bajos-marruecos", 2, 2, "Marruecos"],
    ["costa-de-marfil-noruega", 1, 0],
    ["francia-suecia", 2, 0],
    ["mexico-ecuador", 0, 0],
    ["inglaterra-rd-congo", 1, 0],
    ["belgica-senegal", 3, 3, "Bélgica"],
    ["estados-unidos-bosnia", 1, 1]
  ]),
  ...participantPredictions("rebe-mama", [
    ["sudafrica-canada", 1, 1],
    ["brasil-japon", 1, 0],
    ["alemania-paraguay", 2, 2, "Paraguay"],
    ["paises-bajos-marruecos", 0, 0, "Marruecos"],
    ["costa-de-marfil-noruega", 0, 1],
    ["francia-suecia", 1, 0],
    ["mexico-ecuador", 1, 0],
    ["inglaterra-rd-congo", 1, 1],
    ["belgica-senegal", 1, 1, "Bélgica"],
    ["estados-unidos-bosnia", 0, 0]
  ]),
  ...participantPredictions("pedro", [
    ["sudafrica-canada", 0, 0],
    ["brasil-japon", 1, 0],
    ["alemania-paraguay", 2, 2, "Alemania"],
    ["paises-bajos-marruecos", 2, 2, "Marruecos"],
    ["costa-de-marfil-noruega", 1, 0],
    ["francia-suecia", 2, 0],
    ["mexico-ecuador", 0, 1],
    ["inglaterra-rd-congo", 1, 1],
    ["belgica-senegal", 3, 3, "Bélgica"],
    ["estados-unidos-bosnia", 0, 0]
  ])
];

export const auditLogs: AuditLog[] = [
  audit("seed-resultados", "bulk_seed", "matches", "resultados-iniciales", "Carga inicial de resultados registrados."),
  audit("seed-pronosticos", "bulk_seed", "predictions", "pronosticos-iniciales", "Carga inicial de pronosticos familiares."),
  audit("seed-exclusion", "update", "matches", "sudafrica-canada", "Partido excluido conforme a reglas de la quiniela."),
  audit("seed-recalculo", "recalculate", "prediction_scores", "all", "Recalculo inicial con version mundial-2026-v1.")
];

export const scores = recalculateAllScores(matches, predictions, LAST_UPDATED_AT);
export const standings = buildStandingsWithRecentMovement(participants, matches, predictions, scores);

export const publicSnapshot: PublicSnapshot = {
  participants,
  matches,
  predictions,
  scores,
  standings,
  auditLogs,
  settings: {
    entryAmount: 200,
    prizePool: 1800,
    prizes: [
      { place: "Primer lugar", amount: 1000 },
      { place: "Segundo lugar", amount: 500 },
      { place: "Tercer lugar", amount: 300 }
    ],
    lastUpdatedAt: LAST_UPDATED_AT
  }
};

function participant(slug: string, name: string): Participant {
  return {
    id: slug,
    name,
    slug,
    paid: true,
    entryAmount: 200,
    active: true,
    createdAt: CREATED_AT,
    updatedAt: LAST_UPDATED_AT
  };
}

function scheduledMatch(
  id: string,
  homeTeam: string,
  awayTeam: string,
  kickoffAt: string
): MatchRecord {
  return {
    id,
    externalId: null,
    stage: "Eliminatoria",
    homeTeam,
    awayTeam,
    kickoffAt,
    status: "scheduled",
    homeScore90: null,
    awayScore90: null,
    advancingTeam: null,
    completedAt: null,
    createdAt: CREATED_AT,
    updatedAt: LAST_UPDATED_AT
  };
}

function completedMatch(
  id: string,
  homeTeam: string,
  awayTeam: string,
  kickoffAt: string,
  homeScore90: number,
  awayScore90: number,
  advancingTeam: string | null = null
): MatchRecord {
  return {
    ...scheduledMatch(id, homeTeam, awayTeam, kickoffAt),
    status: "completed",
    homeScore90,
    awayScore90,
    advancingTeam,
    completedAt: kickoffAt,
    updatedAt: LAST_UPDATED_AT
  };
}

function excludedMatch(id: string, homeTeam: string, awayTeam: string, kickoffAt: string): MatchRecord {
  return {
    ...scheduledMatch(id, homeTeam, awayTeam, kickoffAt),
    status: "excluded",
    updatedAt: LAST_UPDATED_AT
  };
}

type PredictionTuple = [
  matchId: string,
  predictedHomeScore: number,
  predictedAwayScore: number,
  predictedAdvancingTeam?: string
];

function participantPredictions(
  participantId: string,
  tuples: PredictionTuple[]
): Prediction[] {
  return tuples.map(([matchId, predictedHomeScore, predictedAwayScore, predictedAdvancingTeam]) => ({
    id: `${participantId}-${matchId}`,
    participantId,
    matchId,
    predictedHomeScore,
    predictedAwayScore,
    predictedAdvancingTeam: predictedAdvancingTeam ?? null,
    submittedAt: "2026-06-10T23:00:00.000Z",
    status: "valid",
    source: "whatsapp",
    notes: null,
    createdAt: CREATED_AT,
    updatedAt: LAST_UPDATED_AT
  }));
}

function audit(
  id: string,
  action: string,
  entityType: string,
  entityId: string,
  reason: string
): AuditLog {
  return {
    id,
    actorId: null,
    action,
    entityType,
    entityId,
    beforeData: null,
    afterData: null,
    reason,
    createdAt: LAST_UPDATED_AT
  };
}

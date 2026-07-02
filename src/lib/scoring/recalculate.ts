import type { MatchRecord, Prediction, PredictionScore } from "@/lib/types";
import { calculatePredictionScore, CALCULATION_VERSION } from "./calculate";

const STABLE_CALCULATION_DATE = "2026-07-02T12:00:00.000Z";

export function recalculateAllScores(
  matches: MatchRecord[],
  predictions: Prediction[],
  calculatedAt = STABLE_CALCULATION_DATE
): PredictionScore[] {
  const matchesById = new Map(matches.map((match) => [match.id, match]));

  return predictions
    .map((prediction) => {
      const match = matchesById.get(prediction.matchId);
      if (!match) return null;
      const calculation = calculatePredictionScore(match, prediction);

      return {
        id: `score-${prediction.id}`,
        predictionId: prediction.id,
        exactScorePoints: calculation.exactScorePoints,
        outcomePoints: calculation.outcomePoints,
        totalPoints: calculation.totalPoints,
        reason: calculation.reason,
        status: calculation.status,
        calculationVersion: CALCULATION_VERSION,
        calculatedAt
      } satisfies PredictionScore;
    })
    .filter((score): score is PredictionScore => score !== null);
}

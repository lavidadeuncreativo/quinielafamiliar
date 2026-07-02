import type { MatchRecord, Prediction, ScoreStatus, TeamName } from "@/lib/types";

export const CALCULATION_VERSION = "mundial-2026-v1";

export interface ScoreCalculation {
  exactScorePoints: number;
  outcomePoints: number;
  totalPoints: number;
  reason: string;
  status: ScoreStatus;
}

function winnerFromScores(
  homeScore: number | null,
  awayScore: number | null,
  homeTeam: TeamName,
  awayTeam: TeamName
): TeamName | null {
  if (homeScore === null || awayScore === null) return null;
  if (homeScore > awayScore) return homeTeam;
  if (awayScore > homeScore) return awayTeam;
  return null;
}

function hasScores(homeScore: number | null, awayScore: number | null): homeScore is number {
  return homeScore !== null && awayScore !== null;
}

function sameTeam(left: TeamName | null, right: TeamName | null): boolean {
  return Boolean(left && right && left.trim().toLowerCase() === right.trim().toLowerCase());
}

function nc(reason: string): ScoreCalculation {
  return {
    exactScorePoints: 0,
    outcomePoints: 0,
    totalPoints: 0,
    reason,
    status: "nc"
  };
}

function pending(reason: string): ScoreCalculation {
  return {
    exactScorePoints: 0,
    outcomePoints: 0,
    totalPoints: 0,
    reason,
    status: "pending"
  };
}

export function calculatePredictionScore(
  match: MatchRecord,
  prediction: Prediction | null
): ScoreCalculation {
  if (match.status === "excluded") {
    return nc("NC: partido excluido por la organizacion.");
  }

  if (match.status !== "completed") {
    return pending("Pendiente: el partido aun no tiene resultado oficial.");
  }

  if (!hasScores(match.homeScore90, match.awayScore90)) {
    return pending("Pendiente: falta capturar el marcador oficial a 90 minutos.");
  }

  if (!prediction) {
    return nc("NC: no hay pronostico registrado.");
  }

  if (prediction.status === "late") {
    return nc("NC: pronostico tardio, no suma puntos ni cuenta como exacto.");
  }

  if (prediction.status === "missing") {
    return nc("NC: pronostico faltante.");
  }

  if (prediction.status === "invalidated") {
    return nc("NC: pronostico invalidado por correccion administrativa.");
  }

  if (!hasScores(prediction.predictedHomeScore, prediction.predictedAwayScore)) {
    return nc("NC: pronostico sin marcador completo.");
  }

  const officialWinner = winnerFromScores(
    match.homeScore90,
    match.awayScore90,
    match.homeTeam,
    match.awayTeam
  );
  const predictedWinner = winnerFromScores(
    prediction.predictedHomeScore,
    prediction.predictedAwayScore,
    match.homeTeam,
    match.awayTeam
  );
  const exactScore =
    prediction.predictedHomeScore === match.homeScore90 &&
    prediction.predictedAwayScore === match.awayScore90;

  if (officialWinner) {
    if (exactScore) {
      return {
        exactScorePoints: 3,
        outcomePoints: 0,
        totalPoints: 3,
        reason: "Marcador exacto en partido con ganador a 90 minutos: 3 puntos.",
        status: "scored"
      };
    }

    if (sameTeam(predictedWinner, officialWinner)) {
      return {
        exactScorePoints: 0,
        outcomePoints: 1,
        totalPoints: 1,
        reason: `Acierto simple: gano ${officialWinner} a 90 minutos, pero el marcador no fue exacto.`,
        status: "scored"
      };
    }

    return {
      exactScorePoints: 0,
      outcomePoints: 0,
      totalPoints: 0,
      reason: `Sin puntos: el ganador a 90 minutos fue ${officialWinner}.`,
      status: "scored"
    };
  }

  const exactScorePoints = exactScore ? 3 : 0;
  const predictedClassifier = prediction.predictedAdvancingTeam ?? predictedWinner;
  const classifiedCorrectly = sameTeam(predictedClassifier, match.advancingTeam);
  const outcomePoints = classifiedCorrectly ? 1 : 0;
  const totalPoints = exactScorePoints + outcomePoints;

  if (totalPoints === 0) {
    return {
      exactScorePoints: 0,
      outcomePoints: 0,
      totalPoints: 0,
      reason:
        "Sin puntos: el partido empato a 90 minutos y no se acerto marcador exacto ni clasificado.",
      status: "scored"
    };
  }

  if (exactScorePoints === 3 && outcomePoints === 1) {
    return {
      exactScorePoints,
      outcomePoints,
      totalPoints,
      reason: `Empate exacto y clasificado correcto (${match.advancingTeam}): 4 puntos.`,
      status: "scored"
    };
  }

  if (exactScorePoints === 3) {
    return {
      exactScorePoints,
      outcomePoints,
      totalPoints,
      reason: "Empate exacto a 90 minutos: 3 puntos.",
      status: "scored"
    };
  }

  return {
    exactScorePoints,
    outcomePoints,
    totalPoints,
    reason: `Clasificado correcto (${match.advancingTeam}) tras empate a 90 minutos: 1 punto.`,
    status: "scored"
  };
}

import type { MatchRecord, Participant, Prediction, PredictionScore, StandingRow } from "@/lib/types";

export function buildStandings(
  participants: Participant[],
  predictions: Prediction[],
  scores: PredictionScore[],
  baselineScores: PredictionScore[] = scores
): StandingRow[] {
  const currentRows = rankParticipants(participants, predictions, scores);
  const baselineRows = rankParticipants(participants, predictions, baselineScores);
  const baselineByParticipantId = new Map(
    baselineRows.map((row) => [row.participant.id, row])
  );

  return currentRows.map((row) => {
    const baselineRow = baselineByParticipantId.get(row.participant.id);

    return {
      ...row,
      pointsDelta: row.points - (baselineRow?.points ?? 0),
      positionDelta: (baselineRow?.position ?? row.position) - row.position
    };
  });
}

export function buildStandingsWithRecentMovement(
  participants: Participant[],
  matches: MatchRecord[],
  predictions: Prediction[],
  scores: PredictionScore[]
): StandingRow[] {
  const latestCompletedMatch = [...matches]
    .filter((match) => match.status === "completed")
    .sort(
      (left, right) =>
        new Date(right.completedAt ?? right.kickoffAt).getTime() -
        new Date(left.completedAt ?? left.kickoffAt).getTime()
    )[0];

  if (!latestCompletedMatch) {
    return buildStandings(participants, predictions, scores);
  }

  const latestPredictionIds = new Set(
    predictions
      .filter((prediction) => prediction.matchId === latestCompletedMatch.id)
      .map((prediction) => prediction.id)
  );

  const baselineScores = scores.filter((score) => !latestPredictionIds.has(score.predictionId));
  return buildStandings(participants, predictions, scores, baselineScores);
}

function rankParticipants(
  participants: Participant[],
  predictions: Prediction[],
  scores: PredictionScore[]
): StandingRow[] {
  const predictionsById = new Map(predictions.map((prediction) => [prediction.id, prediction]));
  const statsByParticipant = new Map<
    string,
    { points: number; exactScores: number; simpleHits: number; countedMatches: Set<string> }
  >();

  for (const participant of participants) {
    statsByParticipant.set(participant.id, {
      points: 0,
      exactScores: 0,
      simpleHits: 0,
      countedMatches: new Set<string>()
    });
  }

  for (const score of scores) {
    const prediction = predictionsById.get(score.predictionId);
    if (!prediction) continue;
    const stats = statsByParticipant.get(prediction.participantId);
    if (!stats) continue;

    if (score.status !== "pending" && score.reason !== "NC: partido excluido por la organizacion.") {
      stats.countedMatches.add(prediction.matchId);
    }

    stats.points += score.totalPoints;
    if (score.exactScorePoints === 3) stats.exactScores += 1;
    if (score.outcomePoints > 0) stats.simpleHits += 1;
  }

  const rows = participants
    .filter((participant) => participant.active)
    .map((participant) => {
      const stats = statsByParticipant.get(participant.id);
      return {
        participant,
        position: 0,
        points: stats?.points ?? 0,
        pointsDelta: 0,
        positionDelta: 0,
        exactScores: stats?.exactScores ?? 0,
        simpleHits: stats?.simpleHits ?? 0,
        countedMatches: stats?.countedMatches.size ?? 0,
        sharedPosition: false
      } satisfies StandingRow;
    })
    .sort((left, right) => {
      if (right.points !== left.points) return right.points - left.points;
      if (right.exactScores !== left.exactScores) return right.exactScores - left.exactScores;
      return left.participant.name.localeCompare(right.participant.name, "es");
    });

  let currentPosition = 0;
  let lastKey = "";

  return rows.map((row, index, allRows) => {
    const key = `${row.points}:${row.exactScores}`;
    if (key !== lastKey) {
      currentPosition = index + 1;
      lastKey = key;
    }

    const previous = allRows[index - 1];
    const next = allRows[index + 1];
    const sharedWithPrevious =
      previous?.points === row.points && previous?.exactScores === row.exactScores;
    const sharedWithNext = next?.points === row.points && next?.exactScores === row.exactScores;

    return {
      ...row,
      position: currentPosition,
      sharedPosition: sharedWithPrevious || sharedWithNext
    };
  });
}

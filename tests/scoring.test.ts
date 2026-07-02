import { describe, expect, it } from "vitest";
import type { MatchRecord, Participant, Prediction } from "../src/lib/types";
import { calculatePredictionScore } from "../src/lib/scoring/calculate";
import { recalculateAllScores } from "../src/lib/scoring/recalculate";
import { buildStandings, buildStandingsWithRecentMovement } from "../src/lib/scoring/standings";
import { matches, participants, predictions, standings } from "../src/lib/data/seed";

const completedWinnerMatch = match({
  id: "francia-suecia",
  homeTeam: "Francia",
  awayTeam: "Suecia",
  status: "completed",
  homeScore90: 3,
  awayScore90: 0
});

const completedDrawMatch = match({
  id: "alemania-paraguay",
  homeTeam: "Alemania",
  awayTeam: "Paraguay",
  status: "completed",
  homeScore90: 1,
  awayScore90: 1,
  advancingTeam: "Paraguay"
});

describe("calculatePredictionScore", () => {
  it("scores an exact winner result with 3 points", () => {
    const score = calculatePredictionScore(completedWinnerMatch, prediction({ home: 3, away: 0 }));

    expect(score).toMatchObject({
      exactScorePoints: 3,
      outcomePoints: 0,
      totalPoints: 3,
      status: "scored"
    });
  });

  it("scores a correct winner with an incorrect score as 1 point", () => {
    const score = calculatePredictionScore(completedWinnerMatch, prediction({ home: 2, away: 0 }));

    expect(score.totalPoints).toBe(1);
    expect(score.exactScorePoints).toBe(0);
    expect(score.outcomePoints).toBe(1);
  });

  it("scores an incorrect prediction as 0 points", () => {
    const score = calculatePredictionScore(completedWinnerMatch, prediction({ home: 1, away: 2 }));

    expect(score.totalPoints).toBe(0);
  });

  it("scores an exact draw without classifier as 3 points", () => {
    const score = calculatePredictionScore(completedDrawMatch, prediction({ home: 1, away: 1 }));

    expect(score.totalPoints).toBe(3);
    expect(score.exactScorePoints).toBe(3);
    expect(score.outcomePoints).toBe(0);
  });

  it("scores an exact draw and correct classifier as 4 points", () => {
    const score = calculatePredictionScore(
      completedDrawMatch,
      prediction({ home: 1, away: 1, advancingTeam: "Paraguay" })
    );

    expect(score.totalPoints).toBe(4);
    expect(score.exactScorePoints).toBe(3);
    expect(score.outcomePoints).toBe(1);
  });

  it("scores an exact draw and incorrect classifier as 3 points", () => {
    const score = calculatePredictionScore(
      completedDrawMatch,
      prediction({ home: 1, away: 1, advancingTeam: "Alemania" })
    );

    expect(score.totalPoints).toBe(3);
    expect(score.exactScorePoints).toBe(3);
    expect(score.outcomePoints).toBe(0);
  });

  it("scores a non-exact draw with correct classifier as 1 point", () => {
    const score = calculatePredictionScore(
      completedDrawMatch,
      prediction({ home: 2, away: 2, advancingTeam: "Paraguay" })
    );

    expect(score.totalPoints).toBe(1);
    expect(score.exactScorePoints).toBe(0);
    expect(score.outcomePoints).toBe(1);
  });

  it("scores a non-exact draw without classifier as 0 points", () => {
    const score = calculatePredictionScore(completedDrawMatch, prediction({ home: 2, away: 2 }));

    expect(score.totalPoints).toBe(0);
  });

  it("scores a predicted win by the team that advances after a draw as 1 point", () => {
    const score = calculatePredictionScore(completedDrawMatch, prediction({ home: 0, away: 2 }));

    expect(score.totalPoints).toBe(1);
    expect(score.outcomePoints).toBe(1);
  });

  it("marks late predictions as NC with 0 points", () => {
    const score = calculatePredictionScore(
      completedWinnerMatch,
      prediction({ home: 3, away: 0, status: "late" })
    );

    expect(score).toMatchObject({ totalPoints: 0, status: "nc" });
  });

  it("marks excluded matches as NC with 0 points", () => {
    const score = calculatePredictionScore(
      match({ status: "excluded", homeScore90: null, awayScore90: null }),
      prediction({ home: 3, away: 0 })
    );

    expect(score).toMatchObject({ totalPoints: 0, status: "nc" });
  });

  it("marks pending matches as pending with 0 points", () => {
    const score = calculatePredictionScore(
      match({ status: "scheduled", homeScore90: null, awayScore90: null }),
      prediction({ home: 3, away: 0 })
    );

    expect(score).toMatchObject({ totalPoints: 0, status: "pending" });
  });
});

describe("recalculateAllScores", () => {
  it("is idempotent and does not duplicate score rows", () => {
    const once = recalculateAllScores(matches, predictions);
    const twice = recalculateAllScores(matches, predictions);

    expect(twice).toEqual(once);
    expect(new Set(twice.map((score) => score.predictionId)).size).toBe(twice.length);
  });
});

describe("standings", () => {
  it("supports shared positions", () => {
    const rows = buildStandings(
      [
        participant("uno", "Uno"),
        participant("dos", "Dos"),
        participant("tres", "Tres")
      ],
      [
        simplePrediction("p1", "uno", "m1"),
        simplePrediction("p2", "dos", "m2"),
        simplePrediction("p3", "tres", "m3")
      ],
      [
        simpleScore("p1", 5, 1),
        simpleScore("p2", 5, 1),
        simpleScore("p3", 3, 0)
      ]
    );

    expect(rows.map((row) => row.position)).toEqual([1, 1, 3]);
    expect(rows[0]?.sharedPosition).toBe(true);
    expect(rows[1]?.sharedPosition).toBe(true);
  });

  it("uses exact scores as the first tiebreaker", () => {
    const rows = buildStandings(
      [participant("uno", "Uno"), participant("dos", "Dos")],
      [simplePrediction("p1", "uno", "m1"), simplePrediction("p2", "dos", "m2")],
      [simpleScore("p1", 7, 0), simpleScore("p2", 7, 1)]
    );

    expect(rows[0]?.participant.name).toBe("Dos");
    expect(rows[0]?.position).toBe(1);
    expect(rows[1]?.position).toBe(2);
  });

  it("seed produces the required audited table", () => {
    expect(
      standings.map((row) => ({
        position: row.position,
        name: row.participant.name,
        points: row.points,
        exactScores: row.exactScores
      }))
    ).toEqual([
      { position: 1, name: "Israel Cabrera", points: 16, exactScores: 3 },
      { position: 2, name: "Isra chico", points: 11, exactScores: 2 },
      { position: 2, name: "Tío Alfre", points: 11, exactScores: 2 },
      { position: 4, name: "Liz Flores", points: 10, exactScores: 2 },
      { position: 5, name: "Rebeca Granados", points: 9, exactScores: 1 },
      { position: 6, name: "Alfredito", points: 8, exactScores: 1 },
      { position: 7, name: "Nuria", points: 7, exactScores: 1 },
      { position: 8, name: "Rebe mamá", points: 7, exactScores: 0 },
      { position: 9, name: "Pedro", points: 4, exactScores: 0 }
    ]);
  });

  it("seed standings are derived from predictions and scores", () => {
    const recalculated = buildStandingsWithRecentMovement(
      participants,
      matches,
      predictions,
      recalculateAllScores(matches, predictions)
    );

    expect(recalculated).toEqual(standings);
  });
});

function match(overrides: Partial<MatchRecord>): MatchRecord {
  return {
    id: "m1",
    externalId: null,
    stage: "Eliminatoria",
    homeTeam: "Local",
    awayTeam: "Visitante",
    kickoffAt: "2026-06-10T12:00:00.000Z",
    status: "completed",
    homeScore90: 1,
    awayScore90: 0,
    advancingTeam: null,
    completedAt: "2026-06-10T14:00:00.000Z",
    createdAt: "2026-06-10T12:00:00.000Z",
    updatedAt: "2026-06-10T12:00:00.000Z",
    ...overrides
  };
}

function prediction(overrides: {
  home: number | null;
  away: number | null;
  advancingTeam?: string | null;
  status?: Prediction["status"];
}): Prediction {
  return {
    id: "prediction-1",
    participantId: "participant-1",
    matchId: "m1",
    predictedHomeScore: overrides.home,
    predictedAwayScore: overrides.away,
    predictedAdvancingTeam: overrides.advancingTeam ?? null,
    submittedAt: "2026-06-10T12:00:00.000Z",
    status: overrides.status ?? "valid",
    source: "whatsapp",
    notes: null,
    createdAt: "2026-06-10T12:00:00.000Z",
    updatedAt: "2026-06-10T12:00:00.000Z"
  };
}

function participant(id: string, name: string): Participant {
  return {
    id,
    name,
    slug: id,
    paid: true,
    entryAmount: 200,
    active: true,
    createdAt: "2026-06-10T12:00:00.000Z",
    updatedAt: "2026-06-10T12:00:00.000Z"
  };
}

function simplePrediction(id: string, participantId: string, matchId: string): Prediction {
  return {
    ...prediction({ home: 1, away: 0 }),
    id,
    participantId,
    matchId
  };
}

function simpleScore(predictionId: string, points: number, exacts: number) {
  return {
    id: `score-${predictionId}`,
    predictionId,
    exactScorePoints: exacts > 0 ? 3 : 0,
    outcomePoints: exacts > 0 ? 0 : points,
    totalPoints: points,
    reason: "Fixture",
    status: "scored" as const,
    calculationVersion: "test",
    calculatedAt: "2026-06-10T12:00:00.000Z"
  };
}

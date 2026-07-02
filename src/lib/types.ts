export type Role = "admin";

export type MatchStatus = "scheduled" | "live" | "completed" | "excluded";
export type PredictionStatus = "valid" | "late" | "missing" | "invalidated";
export type PredictionSource = "whatsapp" | "image" | "admin";
export type ScoreStatus = "scored" | "nc" | "pending";

export type TeamName = string;

export interface Profile {
  id: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export interface Participant {
  id: string;
  name: string;
  slug: string;
  paid: boolean;
  entryAmount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MatchRecord {
  id: string;
  externalId: string | null;
  stage: string;
  homeTeam: TeamName;
  awayTeam: TeamName;
  kickoffAt: string;
  status: MatchStatus;
  homeScore90: number | null;
  awayScore90: number | null;
  advancingTeam: TeamName | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Prediction {
  id: string;
  participantId: string;
  matchId: string;
  predictedHomeScore: number | null;
  predictedAwayScore: number | null;
  predictedAdvancingTeam: TeamName | null;
  submittedAt: string | null;
  status: PredictionStatus;
  source: PredictionSource;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PredictionScore {
  id: string;
  predictionId: string;
  exactScorePoints: number;
  outcomePoints: number;
  totalPoints: number;
  reason: string;
  status: ScoreStatus;
  calculationVersion: string;
  calculatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeData: Record<string, unknown> | null;
  afterData: Record<string, unknown> | null;
  reason: string;
  createdAt: string;
}

export interface AppSettings {
  key: string;
  value: Record<string, unknown>;
  updatedAt: string;
}

export interface StandingRow {
  participant: Participant;
  position: number;
  points: number;
  pointsDelta: number;
  positionDelta: number;
  exactScores: number;
  simpleHits: number;
  countedMatches: number;
  sharedPosition: boolean;
}

export interface PredictionBreakdown {
  participant: Participant;
  match: MatchRecord;
  prediction: Prediction | null;
  score: PredictionScore | null;
}

export interface PublicSnapshot {
  participants: Participant[];
  matches: MatchRecord[];
  predictions: Prediction[];
  scores: PredictionScore[];
  standings: StandingRow[];
  auditLogs: AuditLog[];
  settings: {
    entryAmount: number;
    prizePool: number;
    prizes: Array<{ place: string; amount: number }>;
    lastUpdatedAt: string;
  };
}

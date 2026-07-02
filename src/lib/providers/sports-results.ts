import type { MatchRecord, TeamName } from "@/lib/types";

export interface SportsResultInput {
  matchId: string;
  homeScore90: number;
  awayScore90: number;
  advancingTeam: TeamName | null;
  reason: string;
}

export interface SportsResultsProvider {
  readonly name: string;
  getResult(match: MatchRecord): Promise<SportsResultInput | null>;
}

export class ManualResultsProvider implements SportsResultsProvider {
  readonly name = "manual";

  async getResult(match: MatchRecord): Promise<SportsResultInput | null> {
    if (match.status !== "completed" || match.homeScore90 === null || match.awayScore90 === null) {
      return null;
    }

    return {
      matchId: match.id,
      homeScore90: match.homeScore90,
      awayScore90: match.awayScore90,
      advancingTeam: match.advancingTeam,
      reason: "Resultado capturado manualmente por el organizador."
    };
  }
}

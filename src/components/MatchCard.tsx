import Link from "next/link";
import type { MatchRecord } from "@/lib/types";
import { formatDateTime, formatScore } from "@/lib/data/repository";
import { StatusBadge } from "./StatusBadge";

export function MatchCard({ match, predictionCount }: { match: MatchRecord; predictionCount?: number }) {
  return (
    <Link
      href={`/partidos/${match.externalId ?? match.id}`}
      className="panel group block p-4 transition hover:border-sky-300 hover:shadow-[0_20px_60px_rgba(29,78,216,.10)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{match.stage}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            {match.homeTeam} <span className="text-slate-300">vs</span> {match.awayTeam}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{formatDateTime(match.kickoffAt)}</p>
        </div>
        <StatusBadge status={match.status} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-sm text-slate-500">90 minutos</span>
        <span className="font-mono text-xl font-semibold text-slate-900">{formatScore(match)}</span>
      </div>
      {match.advancingTeam ? (
        <p className="mt-2 text-sm text-emerald-700">Clasifica: {match.advancingTeam}</p>
      ) : null}
      {typeof predictionCount === "number" ? (
        <p className="mt-2 text-sm text-slate-500">{predictionCount} pronósticos registrados</p>
      ) : null}
    </Link>
  );
}

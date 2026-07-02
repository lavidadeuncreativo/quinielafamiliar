import Link from "next/link";
import type { MatchRecord } from "@/lib/types";
import { formatDateTime, formatScore } from "@/lib/data/repository";
import { StatusBadge } from "./StatusBadge";

export function MatchCard({ match, predictionCount }: { match: MatchRecord; predictionCount?: number }) {
  return (
    <Link
      href={`/partidos/${match.externalId ?? match.id}`}
      className="group relative block overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#131c17,#0f1713)] p-5 shadow-[0_18px_50px_rgba(0,0,0,.22)] transition hover:-translate-y-1 hover:border-lime-300/30 hover:shadow-[0_24px_64px_rgba(0,0,0,.3)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#4ca3ff,#5ef073,#ffd15c,#ff5b5b)]" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/46">{match.stage}</p>
          <h3 className="font-heading mt-3 text-[2rem] font-semibold leading-none text-white">
            {match.homeTeam}
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/26">vs</p>
          <h3 className="font-heading mt-1 text-[2rem] font-semibold leading-none text-white">
            {match.awayTeam}
          </h3>
          <p className="mt-3 text-sm text-white/56">{formatDateTime(match.kickoffAt)}</p>
        </div>
        <StatusBadge status={match.status} />
      </div>
      <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/8 pt-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/46">
            Marcador oficial
          </span>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-heading text-4xl font-semibold text-white">{formatScore(match)}</span>
            <span className="pb-1 text-xs uppercase tracking-[0.18em] text-white/30">90 min</span>
          </div>
        </div>
        {typeof predictionCount === "number" ? (
          <div className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/42">
              Pronósticos
            </p>
            <p className="text-sm font-semibold text-white">{predictionCount} cargados</p>
          </div>
        ) : null}
      </div>
      {match.advancingTeam ? (
        <p className="mt-3 text-sm font-medium text-lime-200">Clasifica: {match.advancingTeam}</p>
      ) : null}
    </Link>
  );
}

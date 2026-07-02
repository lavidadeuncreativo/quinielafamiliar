import Link from "next/link";
import type { MatchRecord } from "@/lib/types";
import { formatDateTime, formatScore } from "@/lib/data/repository";
import { StatusBadge } from "./StatusBadge";

export function MatchCard({ match, predictionCount }: { match: MatchRecord; predictionCount?: number }) {
  return (
    <Link
      href={`/partidos/${match.externalId ?? match.id}`}
      className="group relative block overflow-hidden rounded-[28px] border border-[rgba(15,33,71,.12)] bg-[linear-gradient(160deg,rgba(255,255,255,.96),rgba(246,248,252,.94))] p-5 shadow-[0_18px_50px_rgba(15,23,42,.08)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_24px_64px_rgba(24,67,182,.12)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#1843b6,#10936f,#efbc54,#de3f4b)]" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{match.stage}</p>
          <h3 className="font-heading mt-3 text-[2rem] font-semibold leading-none text-slate-900">
            {match.homeTeam}
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">vs</p>
          <h3 className="font-heading mt-1 text-[2rem] font-semibold leading-none text-slate-900">
            {match.awayTeam}
          </h3>
          <p className="mt-3 text-sm text-slate-500">{formatDateTime(match.kickoffAt)}</p>
        </div>
        <StatusBadge status={match.status} />
      </div>
      <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-200 pt-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Marcador oficial
          </span>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-heading text-4xl font-semibold text-slate-900">{formatScore(match)}</span>
            <span className="pb-1 text-xs uppercase tracking-[0.18em] text-slate-400">90 min</span>
          </div>
        </div>
        {typeof predictionCount === "number" ? (
          <div className="rounded-full bg-slate-100 px-3 py-2 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Pronósticos
            </p>
            <p className="text-sm font-semibold text-slate-900">{predictionCount} cargados</p>
          </div>
        ) : null}
      </div>
      {match.advancingTeam ? (
        <p className="mt-3 text-sm font-medium text-emerald-700">Clasifica: {match.advancingTeam}</p>
      ) : null}
    </Link>
  );
}

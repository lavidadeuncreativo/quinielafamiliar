import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { StandingRow } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StandingsTableProps {
  rows: StandingRow[];
  compact?: boolean;
}

export function StandingsTable({ rows, compact = false }: StandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/90 text-left text-[11px] uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Participante</th>
              <th className="px-4 py-3">Movimiento</th>
              <th className="px-4 py-3 text-right">Pts</th>
              <th className="px-4 py-3 text-right">Exactos</th>
              {!compact ? <th className="px-4 py-3 text-right">Aciertos</th> : null}
              {!compact ? <th className="px-4 py-3 text-right">Cont.</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.participant.id} className="transition hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <span className="position-pill">
                    {row.position}
                    {row.sharedPosition ? "°=" : "°"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/participantes/${row.participant.slug}`}
                    className="font-semibold text-slate-900 transition hover:text-sky-700"
                  >
                    {row.participant.name}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    {row.pointsDelta > 0
                      ? `Sumó ${formatSignedDelta(row.pointsDelta)} en la última actualización`
                      : "Sin cambio de puntos en la última actualización"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <span className={movementClassName(row.positionDelta)}>
                      {row.positionDelta > 0 ? <ArrowUpRight aria-hidden="true" className="size-3.5" /> : null}
                      {row.positionDelta < 0 ? <ArrowDownRight aria-hidden="true" className="size-3.5" /> : null}
                      {row.positionDelta === 0 ? <Minus aria-hidden="true" className="size-3.5" /> : null}
                      {labelPositionDelta(row.positionDelta)}
                    </span>
                    <span className={pointsDeltaClassName(row.pointsDelta)}>
                      {formatSignedDelta(row.pointsDelta)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-lg font-semibold text-slate-900">{row.points}</td>
                <td className="px-4 py-3 text-right text-slate-600">{row.exactScores}</td>
                {!compact ? <td className="px-4 py-3 text-right text-slate-600">{row.simpleHits}</td> : null}
                {!compact ? <td className="px-4 py-3 text-right text-slate-600">{row.countedMatches}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function labelPositionDelta(positionDelta: number): string {
  if (positionDelta > 0) return `Subió ${positionDelta}`;
  if (positionDelta < 0) return `Bajó ${Math.abs(positionDelta)}`;
  return "Se mantiene";
}

function formatSignedDelta(pointsDelta: number): string {
  if (pointsDelta > 0) return `+${pointsDelta} pts`;
  if (pointsDelta < 0) return `${pointsDelta} pts`;
  return "0 pts";
}

function movementClassName(positionDelta: number): string {
  return cn(
    "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
    positionDelta > 0 && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    positionDelta < 0 && "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    positionDelta === 0 && "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
  );
}

function pointsDeltaClassName(pointsDelta: number): string {
  return cn(
    "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
    pointsDelta > 0 && "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    pointsDelta < 0 && "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    pointsDelta === 0 && "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
  );
}

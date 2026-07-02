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
    <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#111914,#0d1411)] shadow-[0_20px_60px_rgba(0,0,0,.26)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/8 text-sm">
          <thead className="bg-[linear-gradient(180deg,rgba(16,28,21,.98),rgba(14,22,18,.96))] text-left text-[11px] uppercase tracking-[0.18em] text-white/48">
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
          <tbody className="divide-y divide-white/6">
            {rows.map((row) => (
              <tr
                key={row.participant.id}
                className={cn(
                  "transition hover:bg-white/[0.03]",
                  row.position === 1 && "bg-[linear-gradient(90deg,rgba(255,209,92,.12),rgba(255,255,255,0))]",
                  row.position === 2 && "bg-[linear-gradient(90deg,rgba(76,163,255,.12),rgba(255,255,255,0))]",
                  row.position === 3 && "bg-[linear-gradient(90deg,rgba(94,240,115,.1),rgba(255,255,255,0))]"
                )}
              >
                <td className="px-4 py-3">
                  <span className={positionClassName(row.position)}>
                    {row.position}
                    {row.sharedPosition ? "°=" : "°"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/participantes/${row.participant.slug}`}
                    className="font-semibold text-white transition hover:text-sky-200"
                  >
                    {row.participant.name}
                  </Link>
                  <p className="mt-1 text-xs text-white/42">
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
                <td className="px-4 py-3 text-right text-2xl font-semibold text-white">{row.points}</td>
                <td className="px-4 py-3 text-right text-white/66">{row.exactScores}</td>
                {!compact ? <td className="px-4 py-3 text-right text-white/66">{row.simpleHits}</td> : null}
                {!compact ? <td className="px-4 py-3 text-right text-white/66">{row.countedMatches}</td> : null}
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
    positionDelta > 0 && "bg-emerald-400/12 text-emerald-200 ring-1 ring-emerald-400/18",
    positionDelta < 0 && "bg-rose-400/12 text-rose-200 ring-1 ring-rose-400/18",
    positionDelta === 0 && "bg-white/6 text-white/58 ring-1 ring-white/10"
  );
}

function pointsDeltaClassName(pointsDelta: number): string {
  return cn(
    "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
    pointsDelta > 0 && "bg-sky-400/12 text-sky-200 ring-1 ring-sky-400/18",
    pointsDelta < 0 && "bg-rose-400/12 text-rose-200 ring-1 ring-rose-400/18",
    pointsDelta === 0 && "bg-white/6 text-white/58 ring-1 ring-white/10"
  );
}

function positionClassName(position: number): string {
  return cn(
    "inline-flex min-w-12 justify-center rounded-full px-2 py-1 font-mono text-xs font-semibold text-white",
    position === 1 &&
      "border border-amber-300/28 bg-[linear-gradient(180deg,rgba(255,209,92,.34),rgba(255,209,92,.16))] text-amber-100",
    position === 2 &&
      "border border-sky-300/24 bg-[linear-gradient(180deg,rgba(76,163,255,.28),rgba(76,163,255,.12))] text-sky-100",
    position === 3 &&
      "border border-emerald-300/24 bg-[linear-gradient(180deg,rgba(94,240,115,.24),rgba(94,240,115,.1))] text-emerald-100",
    position > 3 && "border border-white/10 bg-white/6 text-white/72"
  );
}

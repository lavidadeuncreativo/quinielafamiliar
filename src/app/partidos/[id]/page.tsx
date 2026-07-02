import { notFound } from "next/navigation";
import {
  formatDateTime,
  formatPrediction,
  formatScore,
  getMatchBreakdown,
  getMatchById,
  getPublicSnapshot,
  statusLabel
} from "@/lib/data/repository";
import { StatusBadge } from "@/components/StatusBadge";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const snapshot = await getPublicSnapshot();
  const match = getMatchById(snapshot, id);

  if (!match) notFound();

  const breakdown = getMatchBreakdown(snapshot, id);

  return (
    <main className="page-shell">
      <section className="panel p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-emerald-700/80">{match.stage}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              {match.homeTeam} <span className="text-slate-300">vs</span> {match.awayTeam}
            </h1>
            <p className="mt-2 text-slate-600">{formatDateTime(match.kickoffAt)}</p>
          </div>
          <StatusBadge status={match.status} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Estado" value={statusLabel(match.status)} />
          <Stat label="Resultado 90'" value={formatScore(match)} />
          <Stat label="Clasificado" value={match.advancingTeam ?? "NC"} />
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,.08)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/90 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Participante</th>
                <th className="px-4 py-3">Pronóstico</th>
                <th className="px-4 py-3 text-right">Pts</th>
                <th className="px-4 py-3">Razón</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {breakdown.map(({ participant, prediction, score }) => (
                <tr key={participant.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{participant.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-900">
                    {formatPrediction(prediction)}
                    {prediction?.predictedAdvancingTeam ? (
                      <span className="ml-2 font-sans text-xs text-emerald-700">
                        pasa {prediction.predictedAdvancingTeam}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    {score?.status === "pending" ? "P" : score?.status === "nc" ? "NC" : score?.totalPoints ?? "NC"}
                  </td>
                  <td className="max-w-lg px-4 py-3 text-slate-600">{score?.reason ?? "Sin cálculo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

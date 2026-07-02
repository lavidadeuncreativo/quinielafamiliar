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
            <p className="text-sm uppercase tracking-[0.18em] text-lime-300/78">{match.stage}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {match.homeTeam} <span className="text-white/24">vs</span> {match.awayTeam}
            </h1>
            <p className="mt-2 text-white/58">{formatDateTime(match.kickoffAt)}</p>
          </div>
          <StatusBadge status={match.status} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Estado" value={statusLabel(match.status)} />
          <Stat label="Resultado 90'" value={formatScore(match)} />
          <Stat label="Clasificado" value={match.advancingTeam ?? "NC"} />
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-[24px] border border-white/8 bg-[#101814] shadow-[0_16px_50px_rgba(0,0,0,.22)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/8 text-sm">
            <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-[0.14em] text-white/46">
              <tr>
                <th className="px-4 py-3">Participante</th>
                <th className="px-4 py-3">Pronóstico</th>
                <th className="px-4 py-3 text-right">Pts</th>
                <th className="px-4 py-3">Razón</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {breakdown.map(({ participant, prediction, score }) => (
                <tr key={participant.id}>
                  <td className="px-4 py-3 font-medium text-white">{participant.name}</td>
                  <td className="px-4 py-3 font-mono text-white">
                    {formatPrediction(prediction)}
                    {prediction?.predictedAdvancingTeam ? (
                      <span className="ml-2 font-sans text-xs text-lime-200">
                        pasa {prediction.predictedAdvancingTeam}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-white">
                    {score?.status === "pending" ? "P" : score?.status === "nc" ? "NC" : score?.totalPoints ?? "NC"}
                  </td>
                  <td className="max-w-lg px-4 py-3 text-white/56">{score?.reason ?? "Sin cálculo"}</td>
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
    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-white/42">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

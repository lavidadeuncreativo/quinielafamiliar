import { notFound } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import {
  formatPrediction,
  formatScore,
  getParticipantBreakdown,
  getParticipantBySlug,
  getPublicSnapshot
} from "@/lib/data/repository";

interface ParticipantPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ParticipantPage({ params }: ParticipantPageProps) {
  const { slug } = await params;
  const snapshot = await getPublicSnapshot();
  const participant = getParticipantBySlug(snapshot, slug);

  if (!participant) notFound();

  const standing = snapshot.standings.find((row) => row.participant.id === participant.id);
  const breakdown = getParticipantBreakdown(snapshot, slug);

  return (
    <main className="page-shell">
      <section className="panel p-5 sm:p-7">
        <p className="text-sm uppercase tracking-[0.18em] text-emerald-700/80">Participante</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{participant.name}</h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <Stat label="Posición" value={standing ? `${standing.position}${standing.sharedPosition ? "°=" : "°"}` : "NC"} />
          <Stat label="Puntos" value={standing?.points ?? 0} />
          <Stat label="Exactos" value={standing?.exactScores ?? 0} />
          <Stat label="Contabilizados" value={standing?.countedMatches ?? 0} />
        </div>
      </section>

      <section className="mt-6">
        {breakdown.length === 0 ? (
          <EmptyState title="Sin pronósticos" />
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,.08)]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50/90 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Partido</th>
                    <th className="px-4 py-3">Pronóstico</th>
                    <th className="px-4 py-3">Oficial</th>
                    <th className="px-4 py-3 text-right">Pts</th>
                    <th className="px-4 py-3">Cálculo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {breakdown.map(({ match, prediction, score }) => (
                    <tr key={match.id}>
                      <td className="px-4 py-3 text-slate-900">
                        {match.homeTeam} <span className="text-slate-300">vs</span> {match.awayTeam}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-900">
                        {formatPrediction(prediction)}
                        {prediction?.predictedAdvancingTeam ? (
                          <span className="ml-2 font-sans text-xs text-emerald-700">
                            pasa {prediction.predictedAdvancingTeam}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {formatScore(match)}
                        {match.advancingTeam ? (
                          <span className="ml-2 font-sans text-xs text-emerald-700">
                            pasa {match.advancingTeam}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {score?.status === "pending" ? "P" : score?.status === "nc" ? "NC" : score?.totalPoints ?? "NC"}
                      </td>
                      <td className="max-w-md px-4 py-3 text-slate-600">{score?.reason ?? "Sin cálculo"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

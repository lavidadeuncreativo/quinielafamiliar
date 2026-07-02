import { MatchCard } from "@/components/MatchCard";
import { SectionHeader } from "@/components/SectionHeader";
import { getPublicSnapshot } from "@/lib/data/repository";

export default async function PartidosPage() {
  const snapshot = await getPublicSnapshot();
  const counts = new Map<string, number>();
  for (const prediction of snapshot.predictions) {
    counts.set(prediction.matchId, (counts.get(prediction.matchId) ?? 0) + 1);
  }

  return (
    <main className="page-shell space-y-8">
      <section className="premium-band px-5 py-7 sm:px-8 sm:py-8">
        <SectionHeader eyebrow="Calendario del torneo" title="Partidos" />
        <p className="max-w-3xl text-base leading-7 text-slate-700">
          Resultados, próximos cruces y pronósticos cargados por partido.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {snapshot.matches.map((match) => (
          <MatchCard key={match.id} match={match} predictionCount={counts.get(match.id) ?? 0} />
        ))}
      </div>
    </main>
  );
}

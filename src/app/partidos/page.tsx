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
    <main className="page-shell">
      <SectionHeader eyebrow="Calendario" title="Partidos" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {snapshot.matches.map((match) => (
          <MatchCard key={match.id} match={match} predictionCount={counts.get(match.id) ?? 0} />
        ))}
      </div>
    </main>
  );
}

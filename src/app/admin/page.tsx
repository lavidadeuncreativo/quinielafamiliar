import { RotateCw } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { MetricCard } from "@/components/MetricCard";
import { StandingsTable } from "@/components/StandingsTable";
import { recalculateScoresAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/require-admin";
import { formatDateTime, getPublicSnapshot } from "@/lib/data/repository";

export default async function AdminPage() {
  await requireAdmin();
  const snapshot = await getPublicSnapshot();
  const pendingMatches = snapshot.matches.filter((match) => match.status === "scheduled" || match.status === "live");
  const countedMatches = snapshot.matches.filter((match) => match.status === "completed");
  const expectedPredictions =
    snapshot.participants.length * snapshot.matches.filter((match) => match.status !== "excluded").length;
  const missingPredictions = Math.max(expectedPredictions - snapshot.predictions.length, 0);

  return (
    <AdminShell>
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Pendientes" value={pendingMatches.length} />
        <MetricCard label="Contabilizados" value={countedMatches.length} tone="green" />
        <MetricCard label="Pronósticos faltantes" value={missingPredictions} />
        <MetricCard
          label="Último cambio"
          value={<span className="text-xl">{formatDateTime(snapshot.auditLogs[0]?.createdAt ?? null)}</span>}
          tone="gold"
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_.8fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Estado de tabla</h2>
            <form action={recalculateScoresAction}>
              <button className="btn-primary" type="submit">
                <RotateCw aria-hidden="true" className="size-4" />
                Recalcular puntos
              </button>
            </form>
          </div>
          <StandingsTable rows={snapshot.standings} compact />
        </div>
        <div className="grid gap-4">
          <section className="panel p-5">
            <h2 className="font-semibold text-slate-900">Próximos partidos</h2>
            <div className="mt-4 grid gap-3">
              {pendingMatches.slice(0, 5).map((match) => (
                <div key={match.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                  <p className="font-medium text-slate-900">
                    {match.homeTeam} vs {match.awayTeam}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{formatDateTime(match.kickoffAt)}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="panel p-5">
            <h2 className="font-semibold text-slate-900">Últimos cambios</h2>
            <div className="mt-4 grid gap-3">
              {snapshot.auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-[20px] bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-900">{log.action}</p>
                  <p className="mt-1 text-sm text-slate-500">{log.reason}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </AdminShell>
  );
}

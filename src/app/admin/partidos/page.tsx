import { AdminShell } from "@/components/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { saveMatchAction, saveQuickResultAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/require-admin";
import { formatDateTime, getPublicSnapshot } from "@/lib/data/repository";

export default async function AdminPartidosPage() {
  await requireAdmin();
  const snapshot = await getPublicSnapshot();

  return (
    <AdminShell>
      <section className="panel p-5">
        <h2 className="text-xl font-semibold text-slate-900">Crear partido</h2>
        <MatchForm />
      </section>

      <section className="mt-6 grid gap-4">
        {snapshot.matches.map((match) => (
          <article key={match.id} className="panel p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <StatusBadge status={match.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{formatDateTime(match.kickoffAt)}</p>
              </div>
              <form action={saveQuickResultAction} className="grid gap-2 sm:grid-cols-[90px_90px_1fr_auto]">
                <input type="hidden" name="match_id" value={match.id} />
                <input className="field-input mt-0" name="home_score_90" placeholder="Local" inputMode="numeric" />
                <input className="field-input mt-0" name="away_score_90" placeholder="Visita" inputMode="numeric" />
                <input className="field-input mt-0" name="advancing_team" placeholder="Clasificado si empate" />
                <input className="field-input mt-0" name="reason" placeholder="Razón" required />
                <button className="btn-primary sm:col-span-4" type="submit">
                  Registrar resultado
                </button>
              </form>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold text-amber-700">Editar partido</summary>
              <MatchForm match={match} />
            </details>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

function MatchForm({
  match
}: {
  match?: {
    id: string;
    externalId: string | null;
    stage: string;
    homeTeam: string;
    awayTeam: string;
    kickoffAt: string;
    status: string;
    homeScore90: number | null;
    awayScore90: number | null;
    advancingTeam: string | null;
  };
}) {
  return (
    <form action={saveMatchAction} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <input type="hidden" name="id" value={match?.id ?? ""} />
      <label>
        <span className="field-label">External ID</span>
        <input className="field-input" name="external_id" defaultValue={match?.externalId ?? ""} />
      </label>
      <label>
        <span className="field-label">Fase</span>
        <input className="field-input" name="stage" defaultValue={match?.stage ?? "Eliminatoria"} required />
      </label>
      <label>
        <span className="field-label">Local</span>
        <input className="field-input" name="home_team" defaultValue={match?.homeTeam ?? ""} required />
      </label>
      <label>
        <span className="field-label">Visitante</span>
        <input className="field-input" name="away_team" defaultValue={match?.awayTeam ?? ""} required />
      </label>
      <label>
        <span className="field-label">Kickoff ISO</span>
        <input className="field-input" name="kickoff_at" defaultValue={match?.kickoffAt ?? ""} required />
      </label>
      <label>
        <span className="field-label">Estado</span>
        <select className="field-input" name="status" defaultValue={match?.status ?? "scheduled"}>
          <option value="scheduled">Programado</option>
          <option value="live">En vivo</option>
          <option value="completed">Completado</option>
          <option value="excluded">Excluido</option>
        </select>
      </label>
      <label>
        <span className="field-label">Goles local 90</span>
        <input className="field-input" name="home_score_90" defaultValue={match?.homeScore90 ?? ""} inputMode="numeric" />
      </label>
      <label>
        <span className="field-label">Goles visita 90</span>
        <input className="field-input" name="away_score_90" defaultValue={match?.awayScore90 ?? ""} inputMode="numeric" />
      </label>
      <label className="md:col-span-2">
        <span className="field-label">Clasificado</span>
        <input className="field-input" name="advancing_team" defaultValue={match?.advancingTeam ?? ""} />
      </label>
      <label className="md:col-span-2">
        <span className="field-label">Razón</span>
        <input className="field-input" name="reason" placeholder={match ? "Obligatoria al corregir" : "Alta inicial"} required={Boolean(match)} />
      </label>
      <button className="btn-primary md:col-span-2 xl:col-span-4" type="submit">
        Guardar partido
      </button>
    </form>
  );
}

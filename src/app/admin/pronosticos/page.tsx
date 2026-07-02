import { AdminShell } from "@/components/AdminShell";
import { savePredictionAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/require-admin";
import { formatDateTime, getPublicSnapshot } from "@/lib/data/repository";

export default async function AdminPronosticosPage() {
  await requireAdmin();
  const snapshot = await getPublicSnapshot();
  const matchById = new Map(snapshot.matches.map((match) => [match.id, match]));
  const participantById = new Map(snapshot.participants.map((participant) => [participant.id, participant]));

  return (
    <AdminShell>
      <section className="panel p-5">
        <h2 className="text-xl font-semibold text-slate-900">Registrar pronóstico</h2>
        <PredictionForm participants={snapshot.participants} matches={snapshot.matches} />
      </section>

      <section className="mt-6 grid gap-4">
        {snapshot.predictions.map((prediction) => {
          const participant = participantById.get(prediction.participantId);
          const match = matchById.get(prediction.matchId);
          return (
            <article key={prediction.id} className="panel p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-slate-900">
                  {participant?.name ?? "Participante"} · {match?.homeTeam ?? "Local"} vs {match?.awayTeam ?? "Visitante"}
                </h3>
                <p className="text-sm text-slate-500">{formatDateTime(prediction.submittedAt)}</p>
              </div>
              <p className="mt-2 font-mono text-slate-900">
                {prediction.predictedHomeScore ?? "NC"}-{prediction.predictedAwayScore ?? "NC"}
                {prediction.predictedAdvancingTeam ? (
                  <span className="ml-2 font-sans text-xs text-emerald-700">
                    pasa {prediction.predictedAdvancingTeam}
                  </span>
                ) : null}
              </p>
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-amber-700">Corregir pronóstico</summary>
                <PredictionForm
                  prediction={prediction}
                  participants={snapshot.participants}
                  matches={snapshot.matches}
                />
              </details>
            </article>
          );
        })}
      </section>
    </AdminShell>
  );
}

function PredictionForm({
  prediction,
  participants,
  matches
}: {
  prediction?: {
    id: string;
    participantId: string;
    matchId: string;
    predictedHomeScore: number | null;
    predictedAwayScore: number | null;
    predictedAdvancingTeam: string | null;
    submittedAt: string | null;
    status: string;
    source: string;
    notes: string | null;
  };
  participants: Array<{ id: string; name: string }>;
  matches: Array<{ id: string; homeTeam: string; awayTeam: string }>;
}) {
  return (
    <form action={savePredictionAction} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <input type="hidden" name="id" value={prediction?.id ?? ""} />
      <label>
        <span className="field-label">Participante</span>
        <select className="field-input" name="participant_id" defaultValue={prediction?.participantId ?? ""} required>
          <option value="" disabled>
            Selecciona
          </option>
          {participants.map((participant) => (
            <option key={participant.id} value={participant.id}>
              {participant.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="field-label">Partido</span>
        <select className="field-input" name="match_id" defaultValue={prediction?.matchId ?? ""} required>
          <option value="" disabled>
            Selecciona
          </option>
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.homeTeam} vs {match.awayTeam}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="field-label">Local</span>
        <input className="field-input" name="predicted_home_score" defaultValue={prediction?.predictedHomeScore ?? ""} inputMode="numeric" />
      </label>
      <label>
        <span className="field-label">Visita</span>
        <input className="field-input" name="predicted_away_score" defaultValue={prediction?.predictedAwayScore ?? ""} inputMode="numeric" />
      </label>
      <label>
        <span className="field-label">Clasificado</span>
        <input className="field-input" name="predicted_advancing_team" defaultValue={prediction?.predictedAdvancingTeam ?? ""} />
      </label>
      <label>
        <span className="field-label">Entrega ISO</span>
        <input className="field-input" name="submitted_at" defaultValue={prediction?.submittedAt ?? ""} />
      </label>
      <label>
        <span className="field-label">Status</span>
        <select className="field-input" name="status" defaultValue={prediction?.status ?? "valid"}>
          <option value="valid">valid</option>
          <option value="late">late</option>
          <option value="missing">missing</option>
          <option value="invalidated">invalidated</option>
        </select>
      </label>
      <label>
        <span className="field-label">Fuente</span>
        <select className="field-input" name="source" defaultValue={prediction?.source ?? "whatsapp"}>
          <option value="whatsapp">WhatsApp</option>
          <option value="image">Imagen</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <label className="md:col-span-2">
        <span className="field-label">Notas</span>
        <input className="field-input" name="notes" defaultValue={prediction?.notes ?? ""} />
      </label>
      <label className="md:col-span-2">
        <span className="field-label">Razón</span>
        <input className="field-input" name="reason" placeholder={prediction ? "Obligatoria al corregir" : "Alta inicial"} required={Boolean(prediction)} />
      </label>
      <button className="btn-primary md:col-span-2 xl:col-span-4" type="submit">
        Guardar pronóstico
      </button>
    </form>
  );
}

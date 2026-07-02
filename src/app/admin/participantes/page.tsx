import { AdminShell } from "@/components/AdminShell";
import { saveParticipantAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/require-admin";
import { formatCurrency, getPublicSnapshot } from "@/lib/data/repository";

export default async function AdminParticipantesPage() {
  await requireAdmin();
  const snapshot = await getPublicSnapshot();

  return (
    <AdminShell>
      <section className="panel p-5">
        <h2 className="text-xl font-semibold text-slate-900">Crear participante</h2>
        <ParticipantForm />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {snapshot.participants.map((participant) => (
          <article key={participant.id} className="panel p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{participant.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {participant.paid ? "Pagado" : "Pendiente"} · {formatCurrency(participant.entryAmount)}
                </p>
              </div>
              <span className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500">
                {participant.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold text-amber-700">Editar participante</summary>
              <ParticipantForm participant={participant} />
            </details>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

function ParticipantForm({
  participant
}: {
  participant?: {
    id: string;
    name: string;
    slug: string;
    paid: boolean;
    entryAmount: number;
    active: boolean;
  };
}) {
  return (
    <form action={saveParticipantAction} className="mt-4 grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={participant?.id ?? ""} />
      <label>
        <span className="field-label">Nombre</span>
        <input className="field-input" name="name" defaultValue={participant?.name ?? ""} required />
      </label>
      <label>
        <span className="field-label">Slug</span>
        <input className="field-input" name="slug" defaultValue={participant?.slug ?? ""} required />
      </label>
      <label>
        <span className="field-label">Monto</span>
        <input className="field-input" name="entry_amount" defaultValue={participant?.entryAmount ?? 200} inputMode="numeric" required />
      </label>
      <label>
        <span className="field-label">Razón</span>
        <input className="field-input" name="reason" placeholder="Opcional" />
      </label>
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <input type="hidden" name="paid" value="false" />
        <input name="paid" type="checkbox" defaultChecked={participant?.paid ?? true} />
        <span className="text-sm text-slate-600">Pago registrado</span>
      </label>
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <input type="hidden" name="active" value="false" />
        <input name="active" type="checkbox" defaultChecked={participant?.active ?? true} />
        <span className="text-sm text-slate-600">Activo</span>
      </label>
      <button className="btn-primary md:col-span-2" type="submit">
        Guardar participante
      </button>
    </form>
  );
}

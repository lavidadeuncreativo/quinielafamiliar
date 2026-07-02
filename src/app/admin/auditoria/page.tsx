import { AdminShell } from "@/components/AdminShell";
import { requireAdmin } from "@/lib/admin/require-admin";
import { formatDateTime, getPublicSnapshot } from "@/lib/data/repository";

export default async function AdminAuditoriaPage() {
  await requireAdmin();
  const snapshot = await getPublicSnapshot();

  return (
    <AdminShell>
      <section className="grid gap-4">
        {snapshot.auditLogs.map((log) => (
          <article key={log.id} className="panel p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  {log.action} · {log.entityType} · {log.entityId}
                </p>
                <p className="mt-1 text-sm text-slate-600">{log.reason}</p>
              </div>
              <time className="text-sm text-slate-500">{formatDateTime(log.createdAt)}</time>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <JsonBlock label="Antes" value={log.beforeData} />
              <JsonBlock label="Después" value={log.afterData} />
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <pre className="mt-2 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        {JSON.stringify(value ?? {}, null, 2)}
      </pre>
    </div>
  );
}

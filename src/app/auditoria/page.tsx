import { SectionHeader } from "@/components/SectionHeader";
import { formatDateTime, getPublicSnapshot } from "@/lib/data/repository";

export default async function AuditoriaPage() {
  const snapshot = await getPublicSnapshot();

  return (
    <main className="page-shell">
      <SectionHeader eyebrow="Historial" title="Auditoría pública" />
      <div className="grid gap-3">
        {snapshot.auditLogs.map((log) => (
          <article key={log.id} className="panel p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {log.action} · {log.entityType}
                </p>
                <p className="mt-1 text-sm text-slate-600">{log.reason}</p>
              </div>
              <time className="text-sm text-slate-500">{formatDateTime(log.createdAt)}</time>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

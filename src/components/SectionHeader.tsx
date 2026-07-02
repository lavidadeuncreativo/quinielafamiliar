import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700/80">{eyebrow}</p> : null}
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

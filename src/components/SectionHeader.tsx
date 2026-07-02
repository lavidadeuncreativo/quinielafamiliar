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
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700/80">{eyebrow}</p> : null}
        <h2 className="font-heading mt-2 text-3xl font-semibold text-slate-900">{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

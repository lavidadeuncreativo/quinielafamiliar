import type { MatchRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/data/repository";

export function StatusBadge({ status }: { status: MatchRecord["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        status === "completed" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "scheduled" && "border-amber-200 bg-amber-50 text-amber-700",
        status === "live" && "border-lime-200 bg-lime-50 text-lime-700",
        status === "excluded" && "border-slate-200 bg-slate-100 text-slate-500"
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

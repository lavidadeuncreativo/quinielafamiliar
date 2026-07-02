import type { MatchRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/data/repository";

export function StatusBadge({ status }: { status: MatchRecord["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        status === "completed" && "border-emerald-400/24 bg-emerald-400/12 text-emerald-200",
        status === "scheduled" && "border-amber-300/24 bg-amber-300/12 text-amber-200",
        status === "live" && "border-lime-300/24 bg-lime-300/14 text-lime-200",
        status === "excluded" && "border-white/12 bg-white/6 text-white/55"
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

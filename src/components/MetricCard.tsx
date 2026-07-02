import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: "gold" | "green" | "neutral";
}

export function MetricCard({ label, value, detail, tone = "neutral" }: MetricCardProps) {
  return (
    <div
      className={cn(
        "panel p-4",
        tone === "gold" && "border-amber-200 bg-amber-50/70",
        tone === "green" && "border-emerald-200 bg-emerald-50/70"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{value}</div>
      {detail ? <div className="mt-2 text-sm text-slate-600">{detail}</div> : null}
    </div>
  );
}

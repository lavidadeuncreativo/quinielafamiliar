import { CircleAlert } from "lucide-react";

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="panel grid place-items-center px-6 py-12 text-center">
      <CircleAlert aria-hidden="true" className="size-8 text-lime-300" />
      <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
      {detail ? <p className="mt-2 max-w-md text-sm text-white/58">{detail}</p> : null}
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, ClipboardList, History, LogOut, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Resumen", icon: BarChart3 },
  { href: "/admin/partidos", label: "Partidos", icon: ClipboardList },
  { href: "/admin/pronosticos", label: "Pronósticos", icon: ClipboardList },
  { href: "/admin/participantes", label: "Participantes", icon: Users },
  { href: "/admin/auditoria", label: "Auditoría", icon: History }
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="page-shell">
      <div className="mb-6 flex flex-col gap-4 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700/80">Panel privado</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Organizador</h1>
        </div>
        <form action={logoutAction}>
          <button className="btn-secondary" type="submit">
            <LogOut aria-hidden="true" className="size-4" />
            Salir
          </button>
        </form>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {adminLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="nav-link shrink-0 border border-slate-200 bg-white">
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        ))}
      </div>
      {children}
    </main>
  );
}

async function logoutAction() {
  "use server";

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

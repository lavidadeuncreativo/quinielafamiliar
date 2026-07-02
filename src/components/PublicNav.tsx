"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, History, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/tabla", label: "Tabla", icon: BarChart3 },
  { href: "/partidos", label: "Partidos", icon: ClipboardList },
  { href: "/reglas", label: "Reglas", icon: ListChecks },
  { href: "/auditoria", label: "Auditoría", icon: History }
];

export function PublicNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href ||
    pathname?.startsWith(`${href}/`) ||
    (href === "/tabla" && pathname?.startsWith("/participantes"));

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-[rgba(248,244,234,.78)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full border border-white/75 bg-[linear-gradient(135deg,#143fb5,#0f936f)] text-white shadow-[0_12px_28px_rgba(16,34,75,.18)]">
            26
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Family World Cup Pool
            </span>
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
              Quiniela
            </span>
            <span className="block text-xs text-slate-500">Mundial 2026</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/60 p-1 shadow-[0_10px_32px_rgba(15,23,42,.06)] md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "nav-link",
                isActive(href) &&
                  "bg-[linear-gradient(135deg,#10224b,#1843b6)] text-white shadow-[0_10px_24px_rgba(16,34,75,.22)]"
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden rounded-full border border-white/70 bg-white/60 px-3 py-2 text-right shadow-[0_10px_32px_rgba(15,23,42,.06)] md:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Official family edition
          </p>
          <p className="text-sm font-semibold text-slate-900">Tabla y pronósticos</p>
        </div>
      </nav>
      <div className="grid grid-cols-4 border-t border-white/80 bg-white/55 md:hidden">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "mobile-nav-link",
              isActive(href) && "bg-white text-slate-900"
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}

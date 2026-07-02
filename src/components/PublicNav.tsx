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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[rgba(252,250,243,.95)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full border border-white/75 bg-[linear-gradient(135deg,#143fb5,#0f936f)] text-white shadow-[0_12px_28px_rgba(16,34,75,.18)]">
            26
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
              Quiniela Familiar
            </span>
            <span className="block text-xs text-slate-500">Mundial 2026</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-[0_10px_32px_rgba(15,23,42,.05)] md:flex">
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
        <div className="hidden h-10 w-10 md:block" aria-hidden="true" />
      </nav>
      <div className="grid grid-cols-4 border-t border-slate-200 bg-white md:hidden">
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

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
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(8,16,12,.92)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full border border-white/12 bg-[linear-gradient(135deg,#4ca3ff,#5ef073)] text-slate-950 shadow-[0_12px_28px_rgba(0,0,0,.26)]">
            26
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-lime-300/90">
              Dashboard oficial
            </span>
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Quiniela Familiar
            </span>
            <span className="block text-xs text-white/50">Mundial 2026</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/4 p-1 shadow-[0_10px_32px_rgba(0,0,0,.18)] md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "nav-link",
                isActive(href) &&
                  "bg-[linear-gradient(135deg,#1b2d24,#244737)] text-lime-200 shadow-[0_10px_24px_rgba(0,0,0,.24)]"
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden h-10 w-10 md:block" aria-hidden="true" />
      </nav>
      <div className="grid grid-cols-4 border-t border-white/8 bg-[#0b1310] md:hidden">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "mobile-nav-link",
              isActive(href) && "bg-white/8 text-white"
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

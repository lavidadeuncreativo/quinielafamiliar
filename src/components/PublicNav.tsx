import Link from "next/link";
import { BarChart3, ClipboardList, History, ListChecks } from "lucide-react";

const links = [
  { href: "/tabla", label: "Tabla", icon: BarChart3 },
  { href: "/partidos", label: "Partidos", icon: ClipboardList },
  { href: "/reglas", label: "Reglas", icon: ListChecks },
  { href: "/auditoria", label: "Auditoría", icon: History }
];

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_10px_24px_rgba(15,157,122,.12)]">
            Q
          </span>
          <span>
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
              Quiniela
            </span>
            <span className="block text-xs text-slate-500">Mundial 2026</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="nav-link">
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden h-10 w-10 md:block" aria-hidden="true" />
      </nav>
      <div className="grid grid-cols-4 border-t border-slate-200 md:hidden">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="mobile-nav-link">
            <Icon aria-hidden="true" className="size-4" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}

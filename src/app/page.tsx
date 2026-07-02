import Link from "next/link";
import { CalendarClock, Medal, Trophy, Users } from "lucide-react";
import { MatchCard } from "@/components/MatchCard";
import { SectionHeader } from "@/components/SectionHeader";
import { StandingsTable } from "@/components/StandingsTable";
import {
  formatCurrency,
  formatDateTime,
  getLatestResult,
  getNextMatch,
  getPublicSnapshot,
  paymentSummary
} from "@/lib/data/repository";

export default async function HomePage() {
  const snapshot = await getPublicSnapshot();
  const latestResult = getLatestResult(snapshot);
  const nextMatch = getNextMatch(snapshot);
  const podium = snapshot.standings.slice(0, 3);
  const payments = paymentSummary(snapshot);
  const activeMatches = snapshot.matches.filter((match) => match.status !== "excluded").length;
  const completedMatches = snapshot.matches.filter((match) => match.status === "completed").length;

  return (
    <main className="page-shell space-y-8">
      <section className="premium-band px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Quiniela Familiar Mundial 2026
            </p>
            <h1 className="font-heading mt-2 text-4xl font-semibold text-slate-950 sm:text-5xl">
              Tabla general
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Aquí se ve lo importante: posiciones, podio, último resultado y próximo partido.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/tabla" className="btn-primary">
              <Trophy aria-hidden="true" className="size-4" />
              Ver tabla completa
            </Link>
            <Link href="/partidos" className="btn-secondary">
              <CalendarClock aria-hidden="true" className="size-4" />
              Ver partidos
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Bolsa"
            value={formatCurrency(snapshot.settings.prizePool)}
            detail={`${payments.paid}/${payments.total} pagos registrados`}
          />
          <StatCard
            label="Partidos jugados"
            value={String(completedMatches)}
            detail={`${activeMatches - completedMatches} pendientes`}
          />
          <StatCard
            label="Participantes"
            value={String(snapshot.participants.length)}
            detail="Tabla activa"
          />
          <StatCard
            label="Actualizado"
            value={formatDateTime(snapshot.settings.lastUpdatedAt)}
            detail="Hora del centro de México"
          />
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_.8fr]">
        <div>
          <SectionHeader
            eyebrow="Clasificación"
            title="Tabla"
            action={
              <Link href="/tabla" className="btn-secondary">
                <Users aria-hidden="true" className="size-4" />
                Ir al desglose
              </Link>
            }
          />
          <StandingsTable rows={snapshot.standings} compact />
        </div>

        <div className="grid gap-4">
          <section className="panel p-5">
            <div className="flex items-center gap-2 text-amber-600">
              <Medal aria-hidden="true" className="size-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Podio actual</p>
            </div>
            <div className="mt-4 space-y-3">
              {podium.map((row, index) => (
                <article
                  key={row.participant.id}
                  className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {index === 0 ? "1er lugar" : index === 1 ? "2do lugar" : "3er lugar"}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">{row.participant.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{row.points}</p>
                    <p className="text-xs text-slate-500">{row.exactScores} exactos</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {latestResult ? (
            <div>
              <SectionHeader eyebrow="Resultado anterior" title="Último partido" />
              <MatchCard match={latestResult} />
            </div>
          ) : null}

          {nextMatch ? (
            <div>
              <SectionHeader eyebrow="Siguiente en jugarse" title="Próximo partido" />
              <MatchCard match={nextMatch} />
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </article>
  );
}

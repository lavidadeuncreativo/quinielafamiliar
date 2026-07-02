import Link from "next/link";
import { ArrowUpRight, Medal, Shield, Users } from "lucide-react";
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
  const leader = snapshot.standings[0];
  const payments = paymentSummary(snapshot);
  const completedMatches = snapshot.matches.filter((match) => match.status === "completed").length;
  const activeMatches = snapshot.matches.filter((match) => match.status !== "excluded").length;
  const secondPlace = snapshot.standings[1];
  const leaderGap = leader && secondPlace ? leader.points - secondPlace.points : 0;

  return (
    <main className="page-shell space-y-8">
      <section className="premium-band px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime-300/80">
              Quiniela Familiar Mundial 2026
            </p>
            <h1 className="font-heading mt-2 text-4xl font-semibold text-white sm:text-5xl">
              Resumen general
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
              Tabla, podio y partidos clave en una sola vista.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <TopStat
              label="Bolsa"
              value={formatCurrency(snapshot.settings.prizePool)}
              detail={`${payments.paid}/${payments.total} pagos`}
            />
            <TopStat
              label="Participantes"
              value={String(snapshot.participants.length)}
              detail="Activos"
            />
            <TopStat
              label="Partidos"
              value={`${completedMatches}/${activeMatches}`}
              detail="Jugados"
            />
            <TopStat
              label="Actualizado"
              value={formatDateTime(snapshot.settings.lastUpdatedAt)}
              detail="Centro de México"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.35fr_.85fr]">
        <div className="panel p-5 sm:p-6">
          <SectionHeader
            eyebrow="Posiciones"
            title="Tabla general"
            action={
              <Link href="/tabla" className="btn-secondary">
                <Users aria-hidden="true" className="size-4" />
                Ver detalle
              </Link>
            }
          />
          <StandingsTable rows={snapshot.standings} compact />
        </div>

        <div className="grid gap-4">
          <section className="panel p-5">
            <div className="flex items-center gap-2 text-amber-200">
              <Medal aria-hidden="true" className="size-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/88">
                Podio actual
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {podium.map((row, index) => (
                <article
                  key={row.participant.id}
                  className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                        {index === 0 ? "1er lugar" : index === 1 ? "2do lugar" : "3er lugar"}
                      </p>
                      <p className="mt-1 text-base font-semibold text-white">{row.participant.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-white">{row.points}</p>
                      <p className="text-xs text-white/46">pts</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-white/56">
                    <span>{row.exactScores} exactos</span>
                    <span>
                      {row.position}
                      {row.sharedPosition ? "°=" : "°"}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {leader ? (
              <div className="mt-4 rounded-[20px] border border-lime-300/14 bg-lime-300/[0.06] px-4 py-3">
                <div className="flex items-center gap-2 text-lime-200">
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Liderato
                  </p>
                </div>
                <p className="mt-2 text-sm text-white/72">
                  {leader.participant.name} va al frente
                  {leaderGap > 0 ? ` con ventaja de ${leaderGap} punto${leaderGap === 1 ? "" : "s"}.` : "."}
                </p>
              </div>
            ) : null}
          </section>

          {latestResult ? (
            <section>
              <SectionHeader eyebrow="Marcador anterior" title="Último partido" />
              <MatchCard match={latestResult} />
            </section>
          ) : null}

          {nextMatch ? (
            <section>
              <SectionHeader eyebrow="Siguiente en agenda" title="Próximo partido" />
              <MatchCard match={nextMatch} />
            </section>
          ) : null}

          <section className="panel p-5">
            <div className="flex items-center gap-2 text-sky-200">
              <Shield aria-hidden="true" className="size-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/88">
                Reglas rápidas
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              <RuleRow
                title="Marcador exacto"
                detail="Vale 3 puntos."
              />
              <RuleRow
                title="Ganador correcto"
                detail="Vale 1 punto si no hay exacto."
              />
              <RuleRow
                title="Empates"
                detail="Exacto 3, clasificado correcto +1."
              />
              <RuleRow
                title="Desempate"
                detail="Primero puntos, luego exactos."
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function TopStat({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-4 shadow-[0_8px_24px_rgba(0,0,0,.16)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/46">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/54">{detail}</p>
    </article>
  );
}

function RuleRow({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
      <p className="font-medium text-white">{title}</p>
      <p className="text-sm text-white/54">{detail}</p>
    </div>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarClock,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Users
} from "lucide-react";
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
import type { StandingRow } from "@/lib/types";

export default async function HomePage() {
  const snapshot = await getPublicSnapshot();
  const latestResult = getLatestResult(snapshot);
  const nextMatch = getNextMatch(snapshot);
  const payments = paymentSummary(snapshot);
  const leader = snapshot.standings[0];
  const podium = snapshot.standings.slice(0, 3);
  const topMovers = sortedMovers(snapshot.standings).slice(0, 3);
  const completedMatches = snapshot.matches.filter((match) => match.status === "completed").length;
  const activeMatches = snapshot.matches.filter((match) => match.status !== "excluded").length;
  const coverage = Math.round(
    (snapshot.predictions.length / Math.max(snapshot.participants.length * activeMatches, 1)) * 100
  );
  const exactLeader = [...snapshot.standings].sort(
    (left, right) => right.exactScores - left.exactScores || right.points - left.points
  )[0];
  const secondPlace = snapshot.standings[1];
  const gapToSecond = leader && secondPlace ? leader.points - secondPlace.points : 0;

  return (
    <main className="page-shell space-y-10">
      <section className="premium-band px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.18fr_.82fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-800 shadow-[0_10px_20px_rgba(15,23,42,.05)]">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Family World Cup Pool
            </div>
            <h1 className="font-heading mt-6 max-w-4xl text-5xl font-semibold leading-[0.92] text-slate-950 sm:text-6xl lg:text-7xl">
              La quiniela de la familia, presentada como si FIFA nos hubiera hecho la página.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              Tabla clara desde el primer segundo, movimientos de posiciones fáciles de leer y un
              frente visual que ya se siente como tablero oficial de torneo.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/tabla" className="btn-primary">
                <Trophy aria-hidden="true" className="size-4" />
                Ver tabla completa
              </Link>
              <Link href="/partidos" className="btn-secondary">
                <CalendarClock aria-hidden="true" className="size-4" />
                Ver calendario
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <HeroFact
                label="Bolsa del torneo"
                value={formatCurrency(snapshot.settings.prizePool)}
                detail={`${payments.paid}/${payments.total} pagos confirmados`}
              />
              <HeroFact
                label="Partidos contabilizados"
                value={String(completedMatches)}
                detail={`${activeMatches - completedMatches} por jugar`}
              />
              <HeroFact
                label="Cobertura de pronósticos"
                value={`${coverage}%`}
                detail={`${snapshot.predictions.length} registros cargados`}
              />
              <HeroFact
                label="Última actualización"
                value={formatDateTime(snapshot.settings.lastUpdatedAt)}
                detail="Hora del centro de México"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {leader ? (
              <article className="overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#10224b,#1843b6)] p-6 text-white shadow-[0_28px_60px_rgba(16,34,75,.25)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
                      Líder actual
                    </p>
                    <h2 className="font-heading mt-3 text-4xl font-semibold leading-none">
                      {leader.participant.name}
                    </h2>
                    <p className="mt-3 text-sm text-white/72">
                      {leader.exactScores} exactos y {leader.simpleHits} aciertos contabilizados.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
                    {leader.position}
                    {leader.sharedPosition ? "°=" : "°"}
                  </span>
                </div>

                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                      Puntos totales
                    </p>
                    <p className="font-heading mt-2 text-6xl font-semibold leading-none">
                      {leader.points}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-white/10 px-4 py-3 text-right backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                      Ventaja
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {gapToSecond > 0 ? `${gapToSecond} pts` : "Empate"}
                    </p>
                  </div>
                </div>
              </article>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,.06)]">
                <div className="flex items-center gap-2 text-amber-600">
                  <Medal aria-hidden="true" className="size-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                    Podio
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  {podium.map((row, index) => (
                    <div
                      key={row.participant.id}
                      className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          {index === 0 ? "1er lugar" : index === 1 ? "2do lugar" : "3er lugar"}
                        </p>
                        <p className="mt-1 font-semibold text-slate-900">{row.participant.name}</p>
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{row.points}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,.06)]">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Target aria-hidden="true" className="size-4" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                    Precisión
                  </p>
                </div>
                <p className="font-heading mt-4 text-3xl font-semibold text-slate-900">
                  {exactLeader?.participant.name ?? "Pendiente"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Marca el ritmo con {exactLeader?.exactScores ?? 0} marcadores exactos.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.15fr_.85fr]">
        <div>
          <SectionHeader
            eyebrow="Clasificación en vivo"
            title="Tabla al instante"
            action={
              <Link href="/tabla" className="btn-secondary">
                <Users aria-hidden="true" className="size-4" />
                Ir al desglose
              </Link>
            }
          />
          <StandingsTable rows={snapshot.standings.slice(0, 6)} compact />
        </div>

        <div className="grid gap-4">
          <SectionHeader eyebrow="Historias de la jornada" title="Movimiento y presión" />
          <div className="grid gap-4">
            {topMovers.map((row) => (
              <MomentumCard key={row.participant.id} row={row} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[.92fr_1.08fr]">
        <div>
          <SectionHeader eyebrow="Partido destacado" title="Último resultado y lo que sigue" />
          <div className="grid gap-4">
            {latestResult ? <MatchCard match={latestResult} /> : null}
            {nextMatch ? (
              <article className="panel p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Siguiente cita del calendario
                </p>
                <p className="font-heading mt-3 text-3xl font-semibold text-slate-900">
                  {nextMatch.homeTeam} vs {nextMatch.awayTeam}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  El tablero ya está listo para reflejar quién sube y quién cae apenas entre el
                  resultado.
                </p>
              </article>
            ) : null}
          </div>
        </div>

        <div>
          <SectionHeader eyebrow="Lo esencial" title="Premios, reglas y cierre" />
          <div className="surface-grid">
            <SurfaceNote
              icon={<Banknote aria-hidden="true" className="size-5" />}
              title="Premios"
              body={`${formatCurrency(snapshot.settings.prizePool)} acumulados con ${formatCurrency(snapshot.settings.entryAmount)} por entrada.`}
            />
            <SurfaceNote
              icon={<Trophy aria-hidden="true" className="size-5" />}
              title="Desempate"
              body="Primero puntos, luego exactos. Si persiste el empate, se comparte posición."
            />
            <SurfaceNote
              icon={<ArrowUpRight aria-hidden="true" className="size-5" />}
              title="Lectura rápida"
              body="Las flechas verdes y rojas comparan la tabla actual contra la previa al último resultado."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroFact({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[24px] border border-white/75 bg-white/72 px-4 py-4 shadow-[0_14px_28px_rgba(15,23,42,.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </article>
  );
}

function MomentumCard({ row }: { row: StandingRow }) {
  const movedUp = row.positionDelta > 0;
  const movedDown = row.positionDelta < 0;

  return (
    <article className="rounded-[26px] border border-[rgba(15,33,71,.12)] bg-white/92 p-5 shadow-[0_18px_42px_rgba(15,23,42,.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {movedUp ? "Subida del día" : movedDown ? "Retroceso del día" : "Sin cambio"}
          </p>
          <h3 className="font-heading mt-3 text-3xl font-semibold text-slate-900">
            {row.participant.name}
          </h3>
        </div>
        <span
          className={[
            "inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold",
            movedUp && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
            movedDown && "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
            !movedUp && !movedDown && "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {movedUp ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
          {movedDown ? <ArrowDownRight aria-hidden="true" className="size-4" /> : null}
          {movedUp ? `+${row.positionDelta} posición` : movedDown ? `${row.positionDelta} posición` : "Sin movimiento"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[20px] bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Puntos
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{row.points}</p>
        </div>
        <div className="rounded-[20px] bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Última suma
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {row.pointsDelta > 0 ? `+${row.pointsDelta}` : row.pointsDelta}
          </p>
        </div>
      </div>
    </article>
  );
}

function SurfaceNote({
  icon,
  title,
  body
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="panel p-5">
      <div className="flex items-center gap-3 text-sky-700">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}

function sortedMovers(rows: StandingRow[]) {
  const movers = [...rows].sort(
    (left, right) =>
      Math.abs(right.positionDelta) - Math.abs(left.positionDelta) ||
      right.pointsDelta - left.pointsDelta ||
      right.points - left.points
  );

  return movers.some((row) => row.positionDelta !== 0 || row.pointsDelta !== 0) ? movers : rows.slice(0, 3);
}

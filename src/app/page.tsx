import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarClock,
  Medal,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import { MatchCard } from "@/components/MatchCard";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import { StandingsTable } from "@/components/StandingsTable";
import {
  formatCurrency,
  formatDateTime,
  getLatestResult,
  getNextMatch,
  formatScore,
  getPublicSnapshot
} from "@/lib/data/repository";

export default async function HomePage() {
  const snapshot = await getPublicSnapshot();
  const latestResult = getLatestResult(snapshot);
  const nextMatch = getNextMatch(snapshot);
  const leader = snapshot.standings[0];
  const podium = snapshot.standings.slice(0, 3);
  const biggestClimb = [...snapshot.standings].sort(
    (left, right) => right.positionDelta - left.positionDelta || right.pointsDelta - left.pointsDelta
  )[0];
  const biggestPointsJump = [...snapshot.standings].sort(
    (left, right) => right.pointsDelta - left.pointsDelta || right.positionDelta - left.positionDelta
  )[0];

  return (
    <main className="page-shell space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(15,157,122,.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(230,57,70,.14),transparent_24%),linear-gradient(135deg,rgba(255,255,255,.96),rgba(250,246,236,.98))] p-5 sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700/85">
              Mundial 2026
            </p>
            <h1 className="font-heading mt-3 text-5xl font-semibold text-slate-900 sm:text-6xl">
              Quiniela Familiar
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Entra y ve luego luego cómo va la tabla, quién subió posiciones y cuántos puntos se movieron en la última actualización.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/tabla" className="btn-primary">
                <ArrowRight aria-hidden="true" className="size-4" />
                Ver tabla completa
              </Link>
              <Link href="/reglas" className="btn-secondary">
                Reglas
              </Link>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <QuickHighlight
                icon={<Trophy aria-hidden="true" className="size-4" />}
                label="Líder actual"
                value={leader ? `${leader.participant.name} · ${leader.points} pts` : "Pendiente"}
              />
              <QuickHighlight
                icon={<Sparkles aria-hidden="true" className="size-4" />}
                label="Más puntos en la última"
                value={
                  biggestPointsJump
                    ? `${biggestPointsJump.participant.name} · ${signedValue(biggestPointsJump.pointsDelta)}`
                    : "Sin cambios"
                }
              />
              <QuickHighlight
                icon={
                  biggestClimb && biggestClimb.positionDelta >= 0 ? (
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  ) : (
                    <ArrowDownRight aria-hidden="true" className="size-4" />
                  )
                }
                label="Mayor movimiento"
                value={
                  biggestClimb
                    ? `${biggestClimb.participant.name} · ${describeMovement(biggestClimb.positionDelta)}`
                    : "Sin cambios"
                }
              />
            </div>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
            <MetricCard
              label="Bolsa acumulada"
              value={formatCurrency(snapshot.settings.prizePool)}
              detail="Entrada de $200 por participante"
              tone="gold"
            />
            <MetricCard
              label="Participantes"
              value={snapshot.participants.length}
              detail="Familia registrada"
              tone="green"
            />
            <MetricCard
              label="Última actualización"
              value={<span className="text-xl sm:text-2xl">{formatDateTime(snapshot.settings.lastUpdatedAt)}</span>}
              detail="Hora del centro de México"
            />
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="panel p-5">
            <div className="flex items-center gap-3 text-amber-600">
              <Banknote aria-hidden="true" className="size-5" />
              <h2 className="font-semibold text-slate-900">Premios</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {snapshot.settings.prizes.map((prize) => (
                <div key={prize.place} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-500">{prize.place}</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(prize.amount)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-5">
            <div className="flex items-center gap-3 text-emerald-700">
              <Medal aria-hidden="true" className="size-5" />
              <h2 className="font-semibold text-slate-900">Podio actual</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {podium.map((row, index) => (
                <div key={row.participant.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {index === 0 ? "Primer lugar" : index === 1 ? "Segundo lugar" : "Tercer lugar"}
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">{row.participant.name}</p>
                    </div>
                    <span className="position-pill">
                      {row.position}
                      {row.sharedPosition ? "°=" : "°"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">{row.exactScores} exactos</span>
                    <span className="font-semibold text-slate-900">{row.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <div>
          <SectionHeader
            eyebrow="Tabla actual"
            title="Posiciones"
            action={
              <Link href="/tabla" className="btn-secondary">
                <Users aria-hidden="true" className="size-4" />
                Tabla completa
              </Link>
            }
          />
          <StandingsTable rows={snapshot.standings.slice(0, 5)} compact />
        </div>

        <div className="grid gap-4">
          <SectionHeader eyebrow="Partidos" title="Último y próximo movimiento" />
          {latestResult ? <MatchCard match={latestResult} /> : null}
          {latestResult ? (
            <div className="panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700/80">
                Resumen del último resultado
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {latestResult.homeTeam} {formatScore(latestResult)} {latestResult.awayTeam}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La tabla ya refleja ese partido y por eso ahora ves flechas de subida o bajada junto a cada participante.
              </p>
            </div>
          ) : null}
          {nextMatch ? (
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <CalendarClock aria-hidden="true" className="size-4" />
                Próximo partido
              </div>
              <MatchCard match={nextMatch} />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <h2 className="font-semibold text-slate-900">Reglas resumidas</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Marcador exacto con ganador vale 3. Ganador correcto sin exacto vale 1. En empate,
            exacto vale 3 y clasificado correcto agrega 1.
          </p>
        </div>
        <div className="panel p-5">
          <h2 className="font-semibold text-slate-900">Desempates</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Primero puntos, luego marcadores exactos. Si persiste el empate, se comparte posición.
          </p>
        </div>
        <div className="panel p-5">
          <h2 className="font-semibold text-slate-900">Auditoría</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Cada corrección registrada desde el panel privado conserva razón, entidad y fecha.
          </p>
        </div>
      </section>
    </main>
  );
}

function QuickHighlight({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,.05)]">
      <div className="flex items-center gap-2 text-sky-700">{icon}</div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function signedValue(value: number): string {
  if (value > 0) return `+${value} pts`;
  if (value < 0) return `${value} pts`;
  return "0 pts";
}

function describeMovement(positionDelta: number): string {
  if (positionDelta > 0) return `subió ${positionDelta}`;
  if (positionDelta < 0) return `bajó ${Math.abs(positionDelta)}`;
  return "sin cambio";
}

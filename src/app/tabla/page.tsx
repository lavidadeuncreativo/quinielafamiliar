import { SectionHeader } from "@/components/SectionHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { getPublicSnapshot } from "@/lib/data/repository";

export default async function TablaPage() {
  const snapshot = await getPublicSnapshot();

  return (
    <main className="page-shell">
      <SectionHeader eyebrow="Clasificación" title="Tabla completa" />
      <StandingsTable rows={snapshot.standings} />

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <h2 className="font-semibold text-slate-900">Posiciones compartidas</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Se muestran con el símbolo = cuando puntos y marcadores exactos son iguales.
          </p>
        </div>
        <div className="panel p-5">
          <h2 className="font-semibold text-slate-900">Lectura rápida</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            La flecha verde marca quién subió lugares y la roja quién bajó, comparado con la tabla previa al último resultado.
          </p>
        </div>
        <div className="panel p-5">
          <h2 className="font-semibold text-slate-900">Criterios de desempate</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Más puntos, más marcadores exactos y luego posición compartida.
          </p>
        </div>
        <div className="panel p-5 md:col-span-3">
          <h2 className="font-semibold text-slate-900">Premios empatados</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Al finalizar, los premios involucrados se suman y se dividen entre quienes empaten.
          </p>
        </div>
      </section>
    </main>
  );
}

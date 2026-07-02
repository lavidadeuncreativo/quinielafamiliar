import { SectionHeader } from "@/components/SectionHeader";

const rules = [
  {
    title: "Ganador en 90 minutos",
    items: [
      "Marcador exacto: 3 puntos.",
      "Ganador correcto con marcador diferente: 1 punto.",
      "El máximo es 3 puntos; no se suman 3 + 1."
    ]
  },
  {
    title: "Empate en 90 minutos",
    items: [
      "Marcador empatado exacto: 3 puntos.",
      "Clasificado correcto: 1 punto adicional.",
      "Si se pronosticó victoria del equipo que clasificó tras empate, cuenta como clasificado correcto."
    ]
  },
  {
    title: "NC y excluidos",
    items: [
      "Pronóstico tardío: NC, 0 puntos.",
      "Pronóstico faltante o invalidado: NC, 0 puntos.",
      "Sudáfrica vs Canadá está excluido y no suma para nadie."
    ]
  },
  {
    title: "Desempates",
    items: [
      "Primero más puntos.",
      "Luego más marcadores exactos.",
      "Si sigue el empate, la posición se comparte."
    ]
  }
];

export default function ReglasPage() {
  return (
    <main className="page-shell">
      <SectionHeader eyebrow="Puntuación" title="Reglas" />
      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((rule) => (
          <section key={rule.title} className="panel p-5">
            <h2 className="text-xl font-semibold text-slate-900">{rule.title}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {rule.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-1.5 rounded-full bg-amber-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

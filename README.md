# Quiniela Familiar Mundial 2026

Dashboard publico de solo lectura para una quiniela familiar del Mundial 2026, con panel privado para el organizador.

## Stack

- Next.js App Router
- TypeScript estricto
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth solo para el administrador
- Zod
- Vitest
- Playwright
- ESLint
- Vercel

## Ejecutar localmente

```bash
npm install
npm run dev
```

El dashboard publico queda en `http://localhost:3000`.

Sin variables de Supabase, las rutas publicas usan el seed local calculado en TypeScript. El panel `/admin` exige Supabase configurado y una sesion valida.

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` se reserva para tareas administrativas futuras; no se usa en el cliente.

## Supabase

1. Crea un proyecto en Supabase.
2. Copia `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Ejecuta las migraciones:

```bash
supabase db push
```

4. Carga el seed:

```bash
supabase db reset
```

El seed crea participantes, partidos, pronosticos, auditoria inicial y `prediction_scores` calculados desde resultados y pronosticos.

## Usuario administrador

1. En Supabase Auth, crea un usuario con email y password.
2. Ejecuta este SQL sustituyendo el correo:

```sql
insert into public.profiles (id, display_name, role)
select id, 'Organizador', 'admin'
from auth.users
where email = 'organizador@example.com'
on conflict (id) do update
set display_name = excluded.display_name,
    role = excluded.role;
```

Despues entra en `/admin/login`.

## RLS

La migracion activa Row Level Security en todas las tablas.

- El publico puede leer participantes activos, partidos, pronosticos, scores, auditoria y settings.
- Solo usuarios autenticados con `profiles.role = 'admin'` pueden crear o modificar datos.
- Todas las server actions administrativas llaman `requireAdmin()` antes de escribir.

## Motor de puntos

La funcion pura vive en `src/lib/scoring/calculate.ts`.

Reglas principales:

- Ganador en 90 minutos: marcador exacto = 3, ganador correcto = 1, maximo 3.
- Empate en 90 minutos: empate exacto = 3, clasificado correcto = 1 adicional, maximo 4.
- Si alguien pronostica victoria del equipo que clasifica tras empate, cuenta como clasificado correcto.
- `late`, `missing`, `invalidated` y partidos `excluded` se muestran como NC y suman 0.

`recalculateAllScores()` genera IDs deterministas por pronostico y es idempotente. Los totales de tabla salen de `SUM(prediction_scores.total_points)`, no de campos manuales en participantes.

## Pruebas

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

La suite Vitest incluye una prueba de integridad que falla si el seed no produce exactamente:

1. Israel Cabrera - 16 puntos - 3 exactos
2. Isra chico - 11 puntos - 2 exactos
2. Tio Alfre - 11 puntos - 2 exactos
4. Liz Flores - 10 puntos - 2 exactos
5. Rebeca Granados - 9 puntos - 1 exacto
6. Alfredito - 8 puntos - 1 exacto
7. Nuria - 7 puntos - 1 exacto
8. Rebe mama - 7 puntos - 0 exactos
9. Pedro - 4 puntos - 0 exactos

Playwright tiene smoke tests para verificar que el dashboard publico carga sin cuenta y que `/tabla` no tiene formularios ni botones.

## Vercel

1. Importa este directorio como proyecto.
2. Configura las variables de entorno de Supabase.
3. Usa los comandos por defecto:
   - Build: `npm run build`
   - Install: `npm install`
4. Verifica que el proyecto Supabase tenga migraciones y seed aplicados.

## Limitaciones reales

- No hay API deportiva conectada. Existe `SportsResultsProvider` y `ManualResultsProvider`; la primera version captura resultados manualmente.
- No hay cuentas para participantes ni formularios publicos.
- La auditoria publica no muestra el usuario administrador, solo accion, entidad, fecha y razon.
- El seed local y el seed SQL estan alineados por pruebas, pero en produccion el panel admin debe recalcular despues de correcciones.
- No se incluyen logos oficiales ni assets protegidos.
